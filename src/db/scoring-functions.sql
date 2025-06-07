-- Função para calcular pontos baseado na posição (WRC sem bônus)
CREATE OR REPLACE FUNCTION calculate_wrc_points(position_value bigint)
RETURNS numeric AS $$
BEGIN
    CASE position_value
        WHEN 1 THEN RETURN 25;
        WHEN 2 THEN RETURN 18;
        WHEN 3 THEN RETURN 15;
        WHEN 4 THEN RETURN 12;
        WHEN 5 THEN RETURN 10;
        WHEN 6 THEN RETURN 8;
        WHEN 7 THEN RETURN 6;
        WHEN 8 THEN RETURN 4;
        WHEN 9 THEN RETURN 2;
        WHEN 10 THEN RETURN 1;
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar pontos automaticamente
CREATE OR REPLACE FUNCTION update_championship_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcula e atualiza os pontos na tabela de resultados
    NEW.points := calculate_wrc_points(NEW.position);
    
    -- Atualiza ou insere na tabela de classificação geral
    INSERT INTO "rsf-championship-standings" (rsf_user_id, rsf_results_championship_id, points)
    VALUES (
        (SELECT id FROM "rsf-users" WHERE rsf_id = NEW.userid),
        NEW.id,
        NEW.points
    )
    ON CONFLICT (rsf_user_id, rsf_results_championship_id) 
    DO UPDATE SET points = EXCLUDED.points;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar após inserção/atualização de resultados
CREATE OR REPLACE TRIGGER trigger_update_championship_points
    BEFORE INSERT OR UPDATE ON "rsf-results-championship"
    FOR EACH ROW
    EXECUTE FUNCTION update_championship_points();

-- Função para recalcular classificação geral do campeonato
CREATE OR REPLACE FUNCTION recalculate_championship_standings(championship_id uuid)
RETURNS TABLE(
    user_id uuid,
    user_name text,
    total_points numeric,
    position_rank bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.name as user_name,
        COALESCE(SUM(rc.points), 0) as total_points,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(rc.points), 0) DESC, u.name ASC) as position_rank
    FROM "rsf-users" u
    LEFT JOIN "rsf-results-championship" rc ON u.rsf_id = rc.userid
    LEFT JOIN "rsf-custom-championship" cc ON rc.rsf_rally = cc.id
    WHERE cc.id = championship_id OR championship_id IS NULL
    GROUP BY u.id, u.name
    ORDER BY total_points DESC, u.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Função para validar dados antes do cálculo
CREATE OR REPLACE FUNCTION validate_championship_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validação de posição
    IF NEW.position IS NULL OR NEW.position < 1 THEN
        RAISE EXCEPTION 'Posição deve ser um número positivo';
    END IF;
    
    -- Validação de usuário
    IF NEW.userid IS NULL THEN
        RAISE EXCEPTION 'ID do usuário é obrigatório';
    END IF;
    
    -- Verificar se o usuário existe
    IF NOT EXISTS (SELECT 1 FROM "rsf-users" WHERE rsf_id = NEW.userid) THEN
        RAISE EXCEPTION 'Usuário com ID % não encontrado', NEW.userid;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validação
CREATE OR REPLACE TRIGGER trigger_validate_championship_data
    BEFORE INSERT OR UPDATE ON "rsf-results-championship"
    FOR EACH ROW
    EXECUTE FUNCTION validate_championship_data();

-- Função para log de auditoria
CREATE TABLE IF NOT EXISTS "rsf-scoring-audit" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    operation text,
    table_name text,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    user_id uuid
);

CREATE OR REPLACE FUNCTION audit_scoring_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "rsf-scoring-audit" (operation, table_name, record_id, old_values, new_values)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditoria
CREATE OR REPLACE TRIGGER trigger_audit_championship_results
    AFTER INSERT OR UPDATE OR DELETE ON "rsf-results-championship"
    FOR EACH ROW
    EXECUTE FUNCTION audit_scoring_changes();

CREATE OR REPLACE TRIGGER trigger_audit_championship_standings
    AFTER INSERT OR UPDATE OR DELETE ON "rsf-championship-standings"
    FOR EACH ROW
    EXECUTE FUNCTION audit_scoring_changes();