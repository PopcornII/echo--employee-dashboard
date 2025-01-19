SELECT 
    document_id, 
    COUNT(*) AS total_likes
FROM 
    reactions
GROUP BY 
    document_id;



SELECT 
    COUNT(*) AS total_likes
FROM 
    reactions
WHERE 
    document_id = ?;


SELECT 
    user_id, 
    COUNT(*) AS total_reactions
FROM 
    reactions
GROUP BY 
    user_id;
