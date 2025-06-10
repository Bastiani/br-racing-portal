-- Schema para Sistema de Pontuação de Campeonato de Rally
-- Baseado no sistema WRC (World Rally Championship)

-- Tabela de pilotos
CREATE TABLE rsf_pilots (
    id SERIAL PRIMARY KEY,
    userid INTEGER UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    real_name VARCHAR(200),
    nationality CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veículos/carros
CREATE TABLE rsf_cars (
    id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'R2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de campeonatos
CREATE TABLE rsf_championships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    season INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'finished', 'cancelled')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de rallies/eventos
CREATE TABLE rsf_rallies (
    id SERIAL PRIMARY KEY,
    championship_id INTEGER REFERENCES rsf_championships(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    rally_date DATE NOT NULL,
    rsf_rally UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'finished', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de etapas (stages)
CREATE TABLE rsf_stages (
    id SERIAL PRIMARY KEY,
    rally_id INTEGER REFERENCES rsf_rallies(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_number INTEGER NOT NULL,
    distance_km DECIMAL(6,3),
    stage_type VARCHAR(20) DEFAULT 'special' CHECK (stage_type IN ('special', 'super_special', 'power_stage')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rally_id, stage_number)
);

-- Tabela de resultados por etapa
CREATE TABLE rsf_stage_results (
    id SERIAL PRIMARY KEY,
    stage_id INTEGER REFERENCES rsf_stages(id) ON DELETE CASCADE,
    pilot_id INTEGER REFERENCES rsf_pilots(userid) ON DELETE CASCADE,
    car_id INTEGER REFERENCES rsf_cars(id),
    position INTEGER NOT NULL,
    stage_time INTERVAL NOT NULL,
    penalty_time INTERVAL DEFAULT '00:00:00',
    super_rally BOOLEAN DEFAULT FALSE,
    dnf BOOLEAN DEFAULT FALSE, -- Did Not Finish
    dsq BOOLEAN DEFAULT FALSE, -- Disqualified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stage_id, pilot_id)
);

-- Tabela de pontuação WRC (sem power stage bonus)
CREATE TABLE rsf_wrc_points_system (
    position INTEGER PRIMARY KEY,
    points INTEGER NOT NULL
);

-- Inserir sistema de pontuação WRC padrão
INSERT INTO rsf_wrc_points_system (position, points) VALUES
(1, 25), (2, 18), (3, 15), (4, 12), (5, 10),
(6, 8), (7, 6), (8, 4), (9, 2), (10, 1);

-- Tabela de pontuação geral do rally
CREATE TABLE rsf_rally_points (
    id SERIAL PRIMARY KEY,
    rally_id INTEGER REFERENCES rsf_rallies(id) ON DELETE CASCADE,
    pilot_id INTEGER REFERENCES rsf_pilots(userid) ON DELETE CASCADE,
    overall_position INTEGER NOT NULL,
    total_time INTERVAL NOT NULL,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rally_id, pilot_id)
);

-- Tabela de classificação do campeonato
CREATE TABLE rsf_championship_standings (
    id SERIAL PRIMARY KEY,
    championship_id INTEGER REFERENCES rsf_championships(id) ON DELETE CASCADE,
    pilot_id INTEGER REFERENCES rsf_pilots(userid) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    rallies_completed INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    podiums INTEGER DEFAULT 0,
    current_position INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(championship_id, pilot_id)
);

-- Índices para performance
CREATE INDEX idx_rsf_stage_results_stage_pilot ON rsf_stage_results(stage_id, pilot_id);
CREATE INDEX idx_rsf_stage_results_position ON rsf_stage_results(position);
CREATE INDEX idx_rsf_rally_points_rally ON rsf_rally_points(rally_id);
CREATE INDEX idx_rsf_rally_points_position ON rsf_rally_points(overall_position);
CREATE INDEX idx_rsf_championship_standings_points ON rsf_championship_standings(championship_id, total_points DESC);
CREATE INDEX idx_rsf_pilots_nationality ON rsf_pilots(nationality);

-- View para classificação atual do campeonato
CREATE VIEW v_rsf_championship_current_standings AS
SELECT 
    cs.championship_id,
    c.name as championship_name,
    cs.current_position,
    p.username,
    p.real_name,
    p.nationality,
    cs.total_points,
    cs.rallies_completed,
    cs.wins,
    cs.podiums
FROM rsf_championship_standings cs
JOIN rsf_pilots p ON cs.pilot_id = p.userid
JOIN rsf_championships c ON cs.championship_id = c.id
WHERE c.status = 'active'
ORDER BY cs.championship_id, cs.total_points DESC, cs.wins DESC, cs.podiums DESC;

-- View para resultados detalhados de rally
CREATE VIEW v_rsf_rally_detailed_results AS
SELECT 
    r.name as rally_name,
    rp.overall_position,
    p.username,
    p.real_name,
    p.nationality,
    car.model as car_model,
    rp.total_time,
    rp.points_earned,
    r.rally_date
FROM rsf_rally_points rp
JOIN rsf_rallies r ON rp.rally_id = r.id
JOIN rsf_pilots p ON rp.pilot_id = p.userid
JOIN rsf_stage_results sr ON sr.pilot_id = p.userid AND sr.stage_id IN (
    SELECT id FROM rsf_stages WHERE rally_id = r.id LIMIT 1
)
JOIN rsf_cars car ON sr.car_id = car.id
ORDER BY r.rally_date DESC, rp.overall_position