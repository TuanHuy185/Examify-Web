-- Lấy thông tin tất cả answer của question
-- PASS
CREATE OR REPLACE FUNCTION get_all_answer_of_question(question_id INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_to_json(t)) 
    INTO result
    FROM (SELECT * FROM Answer WHERE QuestionID = question_id) AS t;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- SELECT get_all_answer_of_question(1);

-- Lấy nội dung của 1 answer bằng answerID

-- CREATE OR REPLACE FUNCTION get_answer_of_question_by_answerID(question_id INT, answer_id INT)
-- RETURNS JSON AS $$
-- DECLARE
--     result JSON;
-- BEGIN
--     SELECT row_to_json(q) 
--     INTO result
--     FROM (SELECT * FROM Answer WHERE QuestionID = question_id AND ID = answer_id) AS q;

--     RETURN result;
-- END;
-- $$ LANGUAGE plpgsql;

-- SELECT get_answer_of_question_by_answerID(1, 1);

-- Tạo bài Answer
--PASS
CREATE OR REPLACE PROCEDURE create_answer(content_input TEXT, iscorrect_input BOOLEAN, question_id_input INT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Answer (Content, IsCorrect, QuestionID)
    VALUES (content_input, iscorrect_input, question_id_input);
END;
$$;
--PASS
CREATE OR REPLACE FUNCTION add_answer(
    content_input TEXT, 
    iscorrect_input BOOLEAN, 
    question_id_input INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO Answer (Content, IsCorrect, QuestionID)
    VALUES (content_input, iscorrect_input, question_id_input);
END;
$$ LANGUAGE plpgsql;
-- CALL create_answer('a+b=0', false, 1)

-- Chỉnh sửa thông tin của Answer
-- PASS
CREATE OR REPLACE PROCEDURE edit_answer(answer_id INT, content_input TEXT, iscorrect_input BOOLEAN, question_id_input INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Answer
    SET 
        Content = COALESCE(content_input, Content),
        IsCorrect = COALESCE(iscorrect_input, IsCorrect),
        QuestionID = COALESCE(question_id_input, QuestionID)
    WHERE ID = answer_id;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'No answer found with ID %', answer_id;
    END IF;
END;
$$;

-- CALL edit_answer(61, '2x+y=0', null, 1)

-- Xóa bài Answer
-- CREATE OR REPLACE PROCEDURE delete_answer(answer_id INT)
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     DELETE FROM Answer
--     WHERE ID = answer_id;
    
--     IF NOT FOUND THEN
--         RAISE NOTICE 'No answer found with ID %', answer_id;
--     ELSE
--         RAISE NOTICE 'Answer ID % deleted successfully', answer_id;
--     END IF;
-- END;
-- $$;

-- CALL delete_answer(61)