-- Função para atualizar a avaliação média do hostel
CREATE OR REPLACE FUNCTION update_hostel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hostels
  SET avaliacao_media = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE hostel_id = NEW.hostel_id
  )
  WHERE id = NEW.hostel_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar avaliação média quando um review é criado
CREATE TRIGGER update_rating_on_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_hostel_rating();

-- Adicionar política para permitir que usuários atualizem seus próprios reviews
CREATE POLICY "Users can update own reviews"
ON reviews
FOR UPDATE
USING (auth.uid() = user_id);

-- Adicionar política para permitir que usuários deletem seus próprios reviews
CREATE POLICY "Users can delete own reviews"
ON reviews
FOR DELETE
USING (auth.uid() = user_id);