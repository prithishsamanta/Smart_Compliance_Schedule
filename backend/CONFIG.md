# Configuration Setup

## Initial Setup

1. Copy the template file:
   ```bash
   cp src/main/resources/application.properties.template src/main/resources/application.properties
   ```

2. Update the following values in `application.properties`:
   - `spring.datasource.password`: Your MySQL database password
   - `openai.api.key`: Your OpenAI API key (get from https://platform.openai.com/account/api-keys)

## Security Note

The `application.properties` file is excluded from version control to protect sensitive information. Never commit this file to git.

## Required Configuration

- **Database**: MySQL running on localhost:3306 with database `compliance_scheduler`
- **OpenAI API Key**: Valid API key from OpenAI platform
- **Java**: Java 21 or higher 