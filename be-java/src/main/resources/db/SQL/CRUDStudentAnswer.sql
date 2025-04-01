--PASS
CREATE OR REPLACE FUNCTION get_studentAnswer(student_id INT, question_id INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(q) 
    INTO result
    FROM (SELECT * FROM studentAnswer WHERE StudentID = student_id AND QuestionID = question_id) AS q;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- select get_studentAnswer(1, 1);
--PASS
CREATE OR REPLACE PROCEDURE create_studentAnswer(student_id INT, question_id INT) 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO StudentAnswer(StudentID, QuestionID)
    VALUES (student_id, question_id);
END;
$$;

-- call create_studentAnswer(1, 2);
--PASS
CREATE OR REPLACE PROCEDURE update_studentAnswer(student_id INT, question_id INT, answer_id INT) 
LANGUAGE plpgsql
AS $$
DECLARE 
    test_id INT;
    end_time TIMESTAMP;
    is_correct BOOLEAN;
BEGIN
    SELECT a.isCorrect INTO is_correct FROM Answer a, StudentAnswer sa WHERE a.ID = answer_id;

    UPDATE StudentAnswer
    SET
        isCorrect = is_correct,
        answerID = answer_id
    WHERE StudentID = student_id AND QuestionID = question_id;
    SELECT TestID INTO test_id FROM Question WHERE ID = question_id;
    SELECT Endtime INTO end_time FROM Result WHERE StudentID = student_id AND TestID = test_id;
    CALL update_result(student_id, test_id, end_time);

END;
$$;

-- call update_studentAnswer(1, 2, 1);