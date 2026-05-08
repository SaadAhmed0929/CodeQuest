// Mock data for levels
export const mockLevels = [
    {
        level_id: 1,
        title: "Hello World",
        slug: "hello-world",
        order_num: 1,
        points_value: 10,
        coins_value: 5,
        content: {
            concept: "Printing to console",
            task: "Print 'Hello, CodeQuest!' to the console",
            expected_output: "Hello, CodeQuest!",
            initial_code: "# Write your code here\nprint('Hello, World!')"
        }
    },
    {
        level_id: 2,
        title: "Variables",
        slug: "variables",
        order_num: 2,
        points_value: 10,
        coins_value: 5,
        content: {
            concept: "Variables store data",
            task: "Create a variable named 'name' with value 'CodeQuest' and print it.",
            expected_output: "CodeQuest",
            initial_code: "# Create a variable\nname = ''\nprint(name)"
        }
    },
    {
        level_id: 3,
        title: "Numbers and Math",
        slug: "numbers-math",
        order_num: 3,
        points_value: 15,
        coins_value: 7,
        content: {
            concept: "Math operations in Python",
            task: "Calculate 5 + 3 and print the result",
            expected_output: "8",
            initial_code: "# Do math!\nresult = \nprint(result)"
        }
    }
];

// Mock user data
export const mockUser = {
    user_id: 1,
    username: "Python Explorer",
    email: "explorer@codequest.com",
    profile_picture_url: "https://via.placeholder.com/150",
    total_points: 45,
    coins: 20,
    energy_count: 8,
    current_streak: 3,
    streak_freeze_count: 1
};

// Mock progress data
export const mockProgress = [
    { level_id: 1, completed: true },
    { level_id: 2, completed: true }
];
