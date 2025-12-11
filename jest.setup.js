require('@testing-library/jest-dom')

// Mock environment variables for tests
process.env.GMAIL_USER = 'test@gmail.com'
process.env.GMAIL_APP_PASSWORD = 'test-password'
process.env.DESTINATION_EMAIL = 'destination@test.com'
process.env.ALLOWED_ORIGIN = 'http://localhost:3000'