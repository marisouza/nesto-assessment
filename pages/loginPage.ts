import { type Locator, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signupLink: Locator;
    readonly emailError: Locator;
    readonly passwordError: Locator;
    readonly userPasswordError: Locator;
    private language: 'en' | 'fr';

    constructor(page: Page, language: 'en' | 'fr' = 'en') {
        this.page = page;
        this.language = language;
        const localeData = this.getLocaleData();
        this.emailInput = page.getByRole('textbox', { name: 'email' });
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.loginButton = page.getByLabel(localeData.logIn);
        this.forgotPasswordLink = page.getByText(localeData.forgotPasswordLink, { exact: true });
        this.signupLink = page.getByText(localeData.signupLink, { exact: true });
        this.emailError = page.getByText(localeData.loginBlankEmailError, { exact: true });
        this.passwordError = page.getByText(localeData.loginBlankPasswordError, { exact: true });
        this.userPasswordError = page.getByText(localeData.userPasswordError, { exact: true });
    }

    async goto() {
        await this.page.goto('https://app.qa.nesto.ca/');
    }

    async loginInputs(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submitLogin() {  
        await this.loginButton.click();
    }

    // async resetPassword(email: string) {
    //     await this.forgotPasswordLink.click();
    //     // Assuming a modal or page for reset
    //     await this.page.locator('[data-testid="reset-email"]').fill(email);
    //     await this.page.locator('[data-testid="reset-submit"]').click();
    // }

    async getSignupHref() {
        return await this.signupLink.getAttribute('href');
    }

    async getEmailError() {
        return await this.emailError.textContent();
    }

    async getPasswordError() {
        return await this.passwordError.textContent();
    }

     async setLanguage(lang: 'en' | 'fr') {
        await this.page.addInitScript(`localStorage.setItem('language', '${lang}');`);
        await this.page.reload();
    }

    //   duplicate of SignupPage applyConsent - consider refactoring
    async applyConsent() {
        // Fake consent values
        const didomi = 'eyJ1c2VyX2lkIjoiMTliOTBmOGItYTU1OC02YjY2LWJkMGEtNTVkODFkNzIzYjNmIiwiY3JlYXRlZCI6IjIwMjYtMDEtMDZUMDE6NDI6NTguMzg5WiIsInVwZGF0ZWQiOiIyMDI2LTAxLTA2VDAxOjQ5OjQ5LjI3M1oiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzpnb29nbGVhbmEtNFRYbkppZ1IiLCJjOnN3aXRjaGdyby1lZ0FUSmh4SiIsImM6dW5ib3VuY2UiLCJjOmxpbmtlZGluIiwiYzptaWNyb3NvZnQiLCJjOmxhcHJlc3NlLXFiaFVxUW1mIiwiYzpjb252ZXJ0ZXgtekE4cldyVUQiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsiYWR2ZXJ0aXNpbi03V2QyNFJLaiIsInBlcmZvcm1hbmMtRVJQWGZyRmIiXX0sInZlbmRvcnNfbGkiOnsiZW5hYmxlZCI6WyJnb29nbGUiXX0sInZlcnNpb24iOjIsImFjIjoiQUZtQUNBRmsuQUZtQUNBRmsifQ==';
        const eu = 'CQdmyUAQdmyUAAHABBENCMFgAP_AAELAAAAAGMwAgF5gMZAvOACAvMAA.f_gACFgAAAAA';

        // Set localStorage via addInitScript
        await this.page.addInitScript(
            ([didomi, eu]) => {
                try {
                    localStorage.setItem('didomi_token', didomi);
                    localStorage.setItem('euconsent-v2', eu);
                } catch (e) {
                    // Ignore in environments where access is restricted
                    console.error('Could not set localStorage items for consent:', e);
                }
            },
            [didomi, eu]
        );

        // Set cookies
        await this.page.context().addCookies([
            {
                name: 'didomi_token',
                value: didomi,
                domain: 'app.qa.nesto.ca',
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Lax'
            },
            {
                name: 'euconsent-v2',
                value: eu,
                domain: 'app.qa.nesto.ca',
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Lax'
            }
        ]);
    }

    async getLocaleText(key: string) {
        const localeData = this.getLocaleData();
        return localeData[key];
    }

    private getLocaleData() {
        const localeMap = {
            en: 'en-EN.json',
            fr: 'fr-FR.json'
        };
        const localeFile = localeMap[this.language];
        const localePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'resources', 'locales', localeFile);
        const data = fs.readFileSync(localePath, 'utf-8');
        return JSON.parse(data);
    }
}

// await page.request.get('https://auth.nesto.ca/authorize', {
//   params: {
//     client_id: 'Fg4dnbZoCq7oA0rWplMLWnI1oE0HGy3l',
//     scope: 'openid profile email offline_access',
//     redirect_uri: 'https://app.qa.nesto.ca/getaquote/callback',
//     audience: 'https://qa.nesto.ca/api',
//     redirectCount: '0',
//     ui_locales: 'en',
//     passwordless: 'false',
//     prompt: 'none',
//     response_type: 'code',
//     response_mode: 'web_message',
//     state: 'N0pVUG1zbFZhaTFsZWVqTnY5cHBMWmZyTDRxVHFBNGZ+T2RJUXB1b1RURg==',
//     nonce: 'Ny5mdEh+Ynp+RXRpUGNrSW5lWE9WbUloejE2dHRFUW0zZkJ4b0QteDVHRg==',
//     code_challenge: 'l_ldbd9tdUl-uuckST0dzBza_yasYat-bRs_dE5BAGk',
//     code_challenge_method: 'S256',
//     auth0Client: 'eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjQifQ=='
//   },
//   headers: {
//     ':authority': 'auth.nesto.ca',
//     ':method': 'GET',
//     ':path': '/authorize?client_id=Fg4dnbZoCq7oA0rWplMLWnI1oE0HGy3l&scope=openid+profile+email+offline_access&redirect_uri=https%3A%2F%2Fapp.qa.nesto.ca%2Fgetaquote%2Fcallback&audience=https%3A%2F%2Fqa.nesto.ca%2Fapi&redirectCount=0&ui_locales=en&passwordless=false&prompt=none&response_type=code&response_mode=web_message&state=N0pVUG1zbFZhaTFsZWVqTnY5cHBMWmZyTDRxVHFBNGZ%2BT2RJUXB1b1RURg%3D%3D&nonce=Ny5mdEh%2BYnp%2BRXRpUGNrSW5lWE9WbUloejE2dHRFUW0zZkJ4b0QteDVHRg%3D%3D&code_challenge=l_ldbd9tdUl-uuckST0dzBza_yasYat-bRs_dE5BAGk&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjQifQ%3D%3D',
//     ':scheme': 'https',
//     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//     'accept-encoding': 'gzip, deflate, br, zstd',
//     'accept-language': 'en-US',
//     cookie: '__existingsess=Tue Jan 06 2026 23:17:37 GMT-0500 (Eastern Standard Time); __utmzz=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set)|channel=Direct; __utmzzses=1; _gcl_au=1.1.226788353.1767759459; _switch_session_id=ac6ea5b2-4288-4549-9e1c-c077426b3fe3; ga4_ga=GA1.1.1597004392.1767759459; _fbp=fb.1.1767759459042.363262755972684333; FPID=FPID2.2.J6v6GhOWRQeHNutB%2F5xzAXMbiWC33itym2IljWdljmE%3D.1767759459; FPLC=fUyc%2BaZLjvI0jKPuKVXuW2bUjRIEDkNSkRDszONnFeVYrID1a57H0YfpiRd2%2FCfrHXK1d3v2JmBB9qs%2F69U3iJMvnR77HAXbwAgiUs4ee4RhrKKk5kdsYCf%2BE7qlvg%3D%3D; _uetsid=cd832790eb7f11f0aa4033d07948ca4d; _uetvid=cd832530eb7f11f08d44fb8703d82301; _switch_session=eyJjbGlja2lkcyI6e30sImNvb2tpZXMiOnsiZmJwIjoiZmIuMS4xNzY3NzU5NDU5MDQyLjM2MzI2Mjc1NTk3MjY4NDMzMyJ9LCJlbSI6WyJkNDE4MDgwOWJkMDMwNzk4YmViYjQ2ODM0ZGI2MDdiMWZmNzA5ZjNlNDBjN2Y2MjNkOGYzZjYzZGY0ZGUzNWUzIiwiYTA2NTBkYWM4MWNkYjBlMzIyOTZhNjVhYjI0MWFiOGZhMmMzNWUwZGQ1OWZmNmI5MDI3NDUyNWNlNjMyNThlNCJdLCJwaCI6W10sImxhbmRpbmdfcGFnZV9yZWZlcnJlciI6IiIsInNpZCI6ImFjNmVhNWIyLTQyODgtNDU0OS05ZTFjLWMwNzc0MjZiM2ZlMyIsInN0YXJ0X3RpbWUiOjE3Njc3NTk0NTg4ODEsImFjY291bnRfaWQiOiJwNm1KQmU1RzNhdUxrY2x0In0=; did=s%3Av0%3A976ce8df-2f63-4c32-b16c-e0a00cfd5f55.Tu2qngGCWhk8crYHhqV1jGgE%2BVBYzMbAut43ce8faxM; auth0=s%3Aa0O06eCscsBV84diKJVGNeKLzqZ2MTR_.I7bsrQiN%2F5y2fp6CFSUhl9eUgd5ywdJBpOEK1jBp4fo; did_compat=s%3Av0%3A976ce8df-2f63-4c32-b16c-e0a00cfd5f55.Tu2qngGCWhk8crYHhqV1jGgE%2BVBYzMbAut43ce8faxM; auth0_compat=s%3Aa0O06eCscsBV84diKJVGNeKLzqZ2MTR_.I7bsrQiN%2F5y2fp6CFSUhl9eUgd5ywdJBpOEK1jBp4fo; ga4_ga_Z4M617HVKN=GS2.1.s1767759458$o1$g1$t1767759463$j55$l0$h1468319208',
//     priority: 'u=0, i',
//     referer: 'https://app.qa.nesto.ca/',
//     'sec-ch-ua': '"HeadlessChrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"Windows"',
//     'sec-fetch-dest': 'iframe',
//     'sec-fetch-mode': 'navigate',
//     'sec-fetch-site': 'same-site',
//     'sec-fetch-user': '?1',
//     'upgrade-insecure-requests': '1',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.4 Safari/537.36'
//   }
// });

// curl 'https://auth.nesto.ca/authorize?client_id=Fg4dnbZoCq7oA0rWplMLWnI1oE0HGy3l&scope=openid+profile+email+offline_access&redirect_uri=https%3A%2F%2Fapp.qa.nesto.ca%2Fgetaquote%2Fcallback&audience=https%3A%2F%2Fqa.nesto.ca%2Fapi&redirectCount=0&ui_locales=en&passwordless=false&prompt=none&response_type=code&response_mode=web_message&state=N0pVUG1zbFZhaTFsZWVqTnY5cHBMWmZyTDRxVHFBNGZ%2BT2RJUXB1b1RURg%3D%3D&nonce=Ny5mdEh%2BYnp%2BRXRpUGNrSW5lWE9WbUloejE2dHRFUW0zZkJ4b0QteDVHRg%3D%3D&code_challenge=l_ldbd9tdUl-uuckST0dzBza_yasYat-bRs_dE5BAGk&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjQifQ%3D%3D' \
//   -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
//   -H 'accept-language: en-US' \
//   -H 'cookie: __existingsess=Tue Jan 06 2026 23:17:37 GMT-0500 (Eastern Standard Time); __utmzz=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set)|channel=Direct; __utmzzses=1; _gcl_au=1.1.226788353.1767759459; _switch_session_id=ac6ea5b2-4288-4549-9e1c-c077426b3fe3; ga4_ga=GA1.1.1597004392.1767759459; _fbp=fb.1.1767759459042.363262755972684333; FPID=FPID2.2.J6v6GhOWRQeHNutB%2F5xzAXMbiWC33itym2IljWdljmE%3D.1767759459; FPLC=fUyc%2BaZLjvI0jKPuKVXuW2bUjRIEDkNSkRDszONnFeVYrID1a57H0YfpiRd2%2FCfrHXK1d3v2JmBB9qs%2F69U3iJMvnR77HAXbwAgiUs4ee4RhrKKk5kdsYCf%2BE7qlvg%3D%3D; _uetsid=cd832790eb7f11f0aa4033d07948ca4d; _uetvid=cd832530eb7f11f08d44fb8703d82301; _switch_session=eyJjbGlja2lkcyI6e30sImNvb2tpZXMiOnsiZmJwIjoiZmIuMS4xNzY3NzU5NDU5MDQyLjM2MzI2Mjc1NTk3MjY4NDMzMyJ9LCJlbSI6WyJkNDE4MDgwOWJkMDMwNzk4YmViYjQ2ODM0ZGI2MDdiMWZmNzA5ZjNlNDBjN2Y2MjNkOGYzZjYzZGY0ZGUzNWUzIiwiYTA2NTBkYWM4MWNkYjBlMzIyOTZhNjVhYjI0MWFiOGZhMmMzNWUwZGQ1OWZmNmI5MDI3NDUyNWNlNjMyNThlNCJdLCJwaCI6W10sImxhbmRpbmdfcGFnZV9yZWZlcnJlciI6IiIsInNpZCI6ImFjNmVhNWIyLTQyODgtNDU0OS05ZTFjLWMwNzc0MjZiM2ZlMyIsInN0YXJ0X3RpbWUiOjE3Njc3NTk0NTg4ODEsImFjY291bnRfaWQiOiJwNm1KQmU1RzNhdUxrY2x0In0=; did=s%3Av0%3A976ce8df-2f63-4c32-b16c-e0a00cfd5f55.Tu2qngGCWhk8crYHhqV1jGgE%2BVBYzMbAut43ce8faxM; auth0=s%3Aa0O06eCscsBV84diKJVGNeKLzqZ2MTR_.I7bsrQiN%2F5y2fp6CFSUhl9eUgd5ywdJBpOEK1jBp4fo; did_compat=s%3Av0%3A976ce8df-2f63-4c32-b16c-e0a00cfd5f55.Tu2qngGCWhk8crYHhqV1jGgE%2BVBYzMbAut43ce8faxM; auth0_compat=s%3Aa0O06eCscsBV84diKJVGNeKLzqZ2MTR_.I7bsrQiN%2F5y2fp6CFSUhl9eUgd5ywdJBpOEK1jBp4fo; ga4_ga_Z4M617HVKN=GS2.1.s1767759458$o1$g1$t1767759463$j55$l0$h1468319208' \
//   -H 'priority: u=0, i' \
//   -H 'referer: https://app.qa.nesto.ca/' \
//   -H 'sec-ch-ua: "HeadlessChrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'sec-ch-ua-platform: "Windows"' \
//   -H 'sec-fetch-dest: iframe' \
//   -H 'sec-fetch-mode: navigate' \
//   -H 'sec-fetch-site: same-site' \
//   -H 'sec-fetch-user: ?1' \
//   -H 'upgrade-insecure-requests: 1' \
//   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.4 Safari/537.36'


// fetch("https://auth.nesto.ca/authorize?client_id=Fg4dnbZoCq7oA0rWplMLWnI1oE0HGy3l&scope=openid+profile+email+offline_access&redirect_uri=https%3A%2F%2Fapp.qa.nesto.ca%2Fgetaquote%2Fcallback&audience=https%3A%2F%2Fqa.nesto.ca%2Fapi&redirectCount=0&ui_locales=en&passwordless=false&prompt=none&response_type=code&response_mode=web_message&state=N0pVUG1zbFZhaTFsZWVqTnY5cHBMWmZyTDRxVHFBNGZ%2BT2RJUXB1b1RURg%3D%3D&nonce=Ny5mdEh%2BYnp%2BRXRpUGNrSW5lWE9WbUloejE2dHRFUW0zZkJ4b0QteDVHRg%3D%3D&code_challenge=l_ldbd9tdUl-uuckST0dzBza_yasYat-bRs_dE5BAGk&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjQifQ%3D%3D", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "en-US",
//     "priority": "u=0, i",
//     "sec-ch-ua": "\"HeadlessChrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "iframe",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-site",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrer": "https://app.qa.nesto.ca/",
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });