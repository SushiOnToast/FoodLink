# Contributing to FoodLink

Thank you for your interest in contributing to **FoodLink**! This project was created for a hackathon, and we welcome contributions that help improve the platform or introduce new features. Below is a guide to help you get started.

## How to Contribute

1. **Fork the repository**.
   - Click the "Fork" button at the top right of this repository's page.
   
2. **Clone your Fork**.
   ```bash
   git clone https://github.com/your-username/FoodLink.git
   cd FoodLink
   ```
   
3. **Create a new branch for your feature or bug fix**.
   ```bash
   git checkout -b feature/your-branch-name
   ```
   > We recommend using `feature/` or `bugfix/` prefixes when naming your branches.
   
4. **Set up the project and make your changes**.
   - Follow the [Setup Instructions](RUN_LOCALLY.md) to get the project running locally.

5. **Test your changes**.
   - Ensure that your changes work as expected by running the application and testing the affected areas.
   
6. **Commit your changes** with a clear message.
    ```bash
    git commit -m "Add [description of your feature or bug fix]"
    ```

7. **Push your changes** to your forked repository.
    ```bash
    git push origin feature/your-branch-name
    ```

8. **Submit a Pull Request (PR)**.
   - Make sure your branch is up-to-date with the `main` branch:
     ```bash
     git fetch upstream
     git rebase upstream/main
     ```
   - Open a pull request on GitHub:
     - Go to the main repository.
     - Click the "Pull requests" tab.
     - Select your feature branch and open a PR.
     - Provide a detailed description of your changes and any additional context.
     
   - Wait for approval from maintainers.

## Code Style

Please follow these guidelines:
- Use clear, descriptive commit messages, in the imperative form (instead of "added feature", you would say "add feature")
- Write comments for complex or non-obvious code.
- Stick to best practices for both frontend (React) and backend (Django), including meaningful function names and reusable code patterns.

## Issues and Feedback

If you find any bugs, feel free to [open an issue](https://github.com/FoodLink/issues) and include details on how to reproduce the problem.

By contributing, your contributions will be licensed under the [MIT License](LICENSE).

Thanks for your interest in contributing to **FoodLink**!
