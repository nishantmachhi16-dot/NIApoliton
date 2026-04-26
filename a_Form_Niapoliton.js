/**
 * a_Form_Niapoliton.js
 * Professional form handler with ZERO layout impact.
 * Validation is provided through visual glows only.
 */

const CONFIG = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    RATE_LIMIT_MAX: 3,
    RATE_LIMIT_WINDOW_MS: 60000,
    SUBMIT_DEBOUNCE_MS: 300,
    SIMULATED_DELAY_MS: 1500
};

const state = {
    submissions: [],
    isProcessing: false,
    lastSubmitTime: 0
};

/**
 * Sanitizes input string.
 */
const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/[<>]/g, '')
        .replace(/[&"'/]/g, '')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

/**
 * Validates a name string.
 */
const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return (
        name.length >= CONFIG.NAME_MIN_LENGTH &&
        name.length <= CONFIG.NAME_MAX_LENGTH &&
        nameRegex.test(name)
    );
};

/**
 * Validates a single input using visual glows only.
 */
const validateInput = (input) => {
    const cleanVal = sanitize(input.value);

    if (!cleanVal || !isValidName(cleanVal)) {
        input.classList.add('form-input-invalid');
        input.classList.remove('form-input-valid');
        return false;
    }

    input.classList.remove('form-input-invalid');
    input.classList.add('form-input-valid');
    return true;
};

/**
 * Rate limiting check.
 */
const checkRateLimit = () => {
    const now = Date.now();
    state.submissions = state.submissions.filter(t => now - t < CONFIG.RATE_LIMIT_WINDOW_MS);
    return state.submissions.length >= CONFIG.RATE_LIMIT_MAX;
};

/**
 * Main init function.
 */
const init = () => {
    const form = document.querySelector('.textbox');
    if (!form) return;

    const fname = form.querySelector('input[placeholder*="First Name"]');
    const lname = form.querySelector('input[placeholder*="Last Name"]');
    const submitBtn = form.querySelector('input[type="submit"]');

    // Inject Honeypot via JS to keep HTML clean
    const honeyContainer = document.createElement('div');
    honeyContainer.style.display = 'none';
    honeyContainer.innerHTML = '<input type="text" name="b_website" tabindex="-1" autocomplete="off">';
    form.appendChild(honeyContainer);

    // Real-time validation glows
    [fname, lname].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check
        if (form.querySelector('input[name="b_website"]').value) return;

        // Debounce & Processing check
        const now = Date.now();
        if (state.isProcessing || (now - state.lastSubmitTime < CONFIG.SUBMIT_DEBOUNCE_MS)) return;

        // Final validation
        const v1 = validateInput(fname);
        const v2 = validateInput(lname);

        if (!v1 || !v2) {
            form.classList.add('form-shake');
            setTimeout(() => form.classList.remove('form-shake'), 500);
            return;
        }

        if (checkRateLimit()) {
            alert('Too many requests. Please wait a minute.');
            return;
        }

        try {
            state.isProcessing = true;
            state.lastSubmitTime = now;
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            const originalVal = submitBtn.value;
            submitBtn.value = 'Processing...';

            // Simulate API interaction
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    Math.random() > 0.1 ? resolve() : reject(new Error('Server Connection Failed'));
                }, CONFIG.SIMULATED_DELAY_MS);
            });

            state.submissions.push(Date.now());

            // Successful redirection to main site as requested
            window.location.href = 'b_Niapoliton_Site.html';

            form.reset();
            [fname, lname].forEach(i => i.classList.remove('form-input-valid', 'form-input-invalid'));

        } catch (err) {
            alert('Submission failed. Please try again.');
        } finally {
            state.isProcessing = false;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.value = 'Submit';
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
