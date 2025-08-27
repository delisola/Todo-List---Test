-- Criar tabela de todos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (você pode ajustar conforme necessário)
CREATE POLICY "Allow all operations" ON todos FOR ALL USING (true); 