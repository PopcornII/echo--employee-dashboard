CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  class_name VARCHAR(100) NOT NULL -- TailwindCSS classes
);

INSERT INTO roles (name,code, class_name) VALUES
('Super Admin','sa' , 'bg-yellow-500 text-white'),
('Admin','a' ,'bg-red-500 text-white'),
('Teacher','t' ,'bg-green-500 text-white'),
('Student','s' ,'bg-blue-500 text-white'),
('Guest','g' ,'bg-gray-500 text-white');
