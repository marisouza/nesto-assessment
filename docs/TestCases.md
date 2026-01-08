# Test Cases

## Signup Page

1. Form submission
   - should not submit form and show errors inline errors when mandatory fields are empty
   - should not submit form and show inline errorwhen invalid email address is provided
   - should not submit form and show errors inline errors when password mismatch
   -
   - should not submit form and show errors inline errors when password below minimum length
   - should not show error password has minimum char lenght
   - should not show error when password has maximum char lentgh
   - should not submit form and show errors inline errors when password above maximum length
   - should not submit form and show errors inline errors when not matching requirement (one uppercase letter, one lowercase letter and one number)
   - should successfully submit form if all require fileds and requirements are met
2. Password filed
   - no inline error should be shown when password contains special chars(?!#\_- )
3. Link redirrection
   - Log in href should redirect to login page ( validate href value only ??)
   - Terms of Service (check href only since tagert black is responsible for browser to open new tab)
   - Privacy Policy (check href only since tagert black is responsible for browser to open new tab)
4. Error handling
   - Signup using email form existing user should display an error API returns 400
   - should not allow resubmission (fast click create account)

### Security

    - Attempt signup with malicious strings in email/password (e.g., ' OR 1=1 --, admin'--, '; DROP TABLE users;--). Verify the form rejects or sanitizes them without database errors or unauthorized access.

## Login Page

    - should successfully login when username and password provided are correct for an existing user
    - should not login when username provided is incorrect for an existing user
    - should not login when password provided is incorrect for an existing user
    - should show inline errors when empty fields are submitted
    - should be able to reset password
    - should shown inline error for reset password when no email provided
    - should Don't have an account? have correct href / redirect
    - Access sigup page with signed in user should show "Looks like you are already logged in and dashboard link"

## Portfolio Page

1. Menu
   - Settings
     - should be able to change comm preferences
     - should be able to sign out
     - should be able to delete account
   - should be able to switch language
   - should validate privacy policy href
   - should be able to logout
2. Portfolio
   - should be able to navigate to new mortage page
   - should be able to navigate to mortage renewal page
   - should be able to navigate to refinance mortage page

## Consent Page

    - should show consent on first visit
    - should not show consent modal when already accepted
    - should learn more allow to disagre with cookies
