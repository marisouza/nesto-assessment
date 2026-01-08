# Bugs

## Signup Page

- **Issue:** selected country in the dropdown gets reset to default value
- **Description:** In the signup form the country selection dorpdown value gets reset to default values (Canada) when the user clears the values entered in the phone number input field.
- **Steps to Reproduce:**
  1. Go to signup page https://app.qa.nesto.ca/signup
  2. Select a country,other than Canada, from the country phone number dropdown
  3. Enter a phone number in the phone number textbox
  4. Clear the phone number from the input value.
  - **Actual:** the country dropdown selection resets to canada when user clears the value from the phone number input field.
  - **Expected:** the country dropdown selection REMAINS the user's selection when user clears the value from the phone number input field.

- **Issue:** capitalization issue
- **Description:** Privavy policy in french page is not capitalized
- **Steps to Reproduce:**
  1. Go to signup page https://app.qa.nesto.ca/fr/signup
  - **Actual:** text politique de confidentialité is not capitalized
  - **Expected:** text politique de confidentialité should be capitalized to match other text in the FR page as well EN

// Le mot de passe doit contenir au entre 12 et 32 caractères et contenir au moins une lettre majuscule, une lettre minuscule et un chiffre.
issue on text --> remove au

// privavy policy incorrect href value
// https://www.nesto.ca/privacy-policy/ correct url
// current: https://www.nesto.ca

## Login Page

- **Issue:** User selected language not passed to login page
- **Description:** In the signup form the country selection dorpdown value gets reset to default values (Canada) when the user clears the values entered in the phone number input field.
- **Steps to Reproduce:**
  1. Go to signup page https://app.qa.nesto.ca/signup
  2. Click on "FR" as preferred language
  3. Click on "Connexion"
  - **Actual:** User gets redirected to login page where language displayed is english (EN)
  - **Expected:** User gets redirected to login page where language displayed is the user selected in the signup page (FR)

  ???Potential issue:
  login? --> const langPartUrl = language === 'fr' ? 'fr/' : '';
