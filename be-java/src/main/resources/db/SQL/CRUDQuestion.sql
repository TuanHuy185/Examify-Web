-- Lấy thông tin tất cả question của bài test
--PASS
CREATE OR REPLACE FUNCTION get_all_question_of_test(test_id INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT COALESCE(json_agg(json_build_object(
        'id', q.id,
        'content', q.content,
        'score', q.score,
        'testid', q.testid,
        'answers', COALESCE(
            (SELECT json_agg(json_build_object(
                'id', a.id,
                'content', a.content,
                'iscorrect', a.iscorrect,
                'questionid', a.questionid
            ))
            FROM Answer a
            WHERE a.questionid = q.id),
            '[]'::json
        )
    )), '[]'::json)
    INTO result
    FROM Question q
    WHERE q.testid = test_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- SELECT get_all_question_of_test(1);

-- Lấy nội dung của 1 question bằng questionID
--PASS
CREATE OR REPLACE FUNCTION get_question_of_test_by_questionID(test_id INT, question_id INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(q) 
    INTO result
    FROM (SELECT * FROM Question WHERE TestID = test_id AND ID = question_id) AS q;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- SELECT get_question_of_test_by_questionID(1, 1);

-- Tạo bài Question
--PASS
CREATE OR REPLACE PROCEDURE create_question(
    content_input TEXT, 
    score_input FLOAT, 
    test_id_input INT,
    INOUT new_question_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Question (Content, Score, TestID)
    VALUES (content_input, score_input, test_id_input)
    RETURNING ID INTO new_question_id;
END;
$$;
--PASS
CREATE OR REPLACE FUNCTION add_question(
    content_input TEXT, 
    score_input FLOAT, 
    test_id_input INT
) RETURNS INT AS $$
DECLARE
    new_question_id INT;
BEGIN
    INSERT INTO Question (Content, Score, TestID)
    VALUES (content_input, score_input, test_id_input)
    RETURNING ID INTO new_question_id;
    
    RETURN new_question_id;
END;
$$ LANGUAGE plpgsql;

-- CALL create_question('1+1=?', 2.0, 1);

-- Chỉnh sửa thông tin của bài Question
-- PASS
CREATE OR REPLACE PROCEDURE edit_question(question_id INT, content_input TEXT, score_input FLOAT, testID_input INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Question
    SET 
        Content = COALESCE(content_input, Content),
        Score = COALESCE(score_input, Score),
        TestID = COALESCE(testID_input, TestID)
    WHERE ID = question_id;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'No question found with ID %', question_id;
    END IF;
END;
$$;

-- CALL edit_question(17, '2+2=?', null, null);

-- Xóa bài Question
CREATE OR REPLACE PROCEDURE delete_question(question_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Question
    WHERE ID = question_id;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'No question found with ID %', question_id;
    ELSE
        RAISE NOTICE 'Question ID % deleted successfully', question_id;
    END IF;
END;
$$;

-- delete_question(17);