CREATE TABLE user_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'pdf') NOT NULL
    
);
