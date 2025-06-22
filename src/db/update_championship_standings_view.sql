-- Atualização da view v_rsf_championship_current_standings para incluir categoria do piloto
-- Este arquivo contém as instruções SQL para atualizar a view existente

-- Primeiro, remover a view existente
DROP VIEW IF EXISTS "public"."v_rsf_championship_current_standings";

-- Recriar a view com informações de categoria do piloto
CREATE OR REPLACE VIEW "public"."v_rsf_championship_current_standings" AS
SELECT 
    cs.championship_id,
    c.name AS championship_name,
    cs.current_position,
    p.username,
    p.real_name,
    p.nationality,
    cs.total_points,
    cs.rallies_completed,
    cs.wins,
    cs.podiums,
    -- Subconsulta para buscar a categoria mais recente do piloto neste campeonato
    (
        SELECT cc.name
        FROM rsf_rally_points rp
        JOIN rsf_rallies r ON rp.rally_id = r.id
        JOIN rsf_car_categories cc ON rp.category_id = cc.id
        WHERE rp.pilot_id = cs.pilot_id 
        AND r.championship_id = cs.championship_id
        AND rp.category_id IS NOT NULL
        ORDER BY rp.id DESC
        LIMIT 1
    ) AS pilot_category
FROM rsf_championship_standings cs
JOIN rsf_pilots p ON cs.pilot_id = p.userid
JOIN rsf_championships c ON cs.championship_id = c.id
WHERE c.status = 'active'
ORDER BY cs.championship_id, cs.total_points DESC, cs.wins DESC, cs.podiums DESC;

-- Definir o proprietário da view
ALTER TABLE "public"."v_rsf_championship_current_standings" OWNER TO "postgres";

-- Conceder permissões
GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "anon";
GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "authenticated";
GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "service_role";