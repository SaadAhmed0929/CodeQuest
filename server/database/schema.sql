CREATE DATABASE IF NOT EXISTS codequest;
USE codequest;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Google_id VARCHAR(100) UNIQUE NOT NULL,
    profile_picture_url TEXT,
    Total_points INT DEFAULT 0,
    Coins INT DEFAULT 0,
    Energy_count INT DEFAULT 10,
    streak_freeze_count INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    last_streak_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    language_id INT,
    Name VARCHAR(50) NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Slug VARCHAR(100) UNIQUE NOT NULL,
    order_num INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Levels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT,
    Title VARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL,
    order_num INT NOT NULL,
    points_value INT DEFAULT 10,
    coins_value INT DEFAULT 5,
    content JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserProgress (
    Progress_id INT AUTO_INCREMENT PRIMARY KEY,
    User_id INT,
    Level_id INT,
    Completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (Level_id) REFERENCES Levels(level_id) ON DELETE CASCADE,
    UNIQUE (User_id, Level_id)
);

CREATE TABLE IF NOT EXISTS MonthlyLeaderboard (
    Entry_id INT AUTO_INCREMENT PRIMARY KEY,
    User_id INT,
    Language_id INT,
    Month INT NOT NULL,
    Year INT NOT NULL,
    Points_month INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (Language_id) REFERENCES Languages(language_id) ON DELETE CASCADE,
    UNIQUE (User_id, Language_id, Month, Year)
);

CREATE TABLE IF NOT EXISTS ShopItems (
    Item_id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price_coins INT NOT NULL,
    Item_type ENUM('STREAK_FREEZE', 'ENERGY') NOT NULL,
    Quantity_given INT DEFAULT 1,
    Is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS UserPurchase (
    Purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    User_id INT,
    item_id INT,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES ShopItems(Item_id) ON DELETE CASCADE
);

-- Insert defaults
INSERT IGNORE INTO Languages (language_id, Name, Slug) VALUES (1, 'Python', 'python');
INSERT IGNORE INTO ShopItems (Item_id, Name, Description, Price_coins, Item_type, Quantity_given, Is_available) VALUES 
(1, 'Streak Freezer', 'Protects your streak for one day if you miss it.', 50, 'STREAK_FREEZE', 1, 1),
(2, 'Energy Pack', 'Restores 5 energy points to keep you learning.', 25, 'ENERGY', 5, 1);
