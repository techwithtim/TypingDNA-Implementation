import { TypingDNA } from "./typingdna.js";
import { AutocompleteDisabler } from "./autocomplete-disabler.js";

// https://github.com/TypingDNA/autocomplete-disabler

const tdna = new TypingDNA();

const autocompleteDisabler = new AutocompleteDisabler({
  showTypingVisualizer: true,
  showTDNALogo: true,
});
autocompleteDisabler.disableAutocomplete();
autocompleteDisabler.disableCopyPaste();

const loginButton = document.getElementById("login-button");
if (loginButton) {
  loginButton.addEventListener("click", () => loginOrSignUp(true));
  tdna.addTarget("email");
  tdna.addTarget("password");
}

const typingPatternsButton = document.getElementById("typing-patterns-button");
if (typingPatternsButton) {
  typingPatternsButton.addEventListener("click", () => loginOrSignUp(true));
  tdna.addTarget("email");
  tdna.addTarget("password");
}

const signUpButton = document.getElementById("sign-up-button");
if (signUpButton) {
  signUpButton.addEventListener("click", () => loginOrSignUp(false));
  tdna.addTarget("email");
  tdna.addTarget("password");
}

export function loginOrSignUp(login = true) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let endpoint;
  if (login) {
    endpoint = "/api/login";
  } else {
    endpoint = "/api/sign-up";
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.user_id) {
        sendTypingData(data.user_id, email + password);
      } else if (data.message) {
        alert(data.message);
      }
    });
}

function sendTypingData(id, text) {
  const pattern = tdna.getTypingPattern({
    type: 1,
    text: text,
  });
  fetch("/typingdna", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pattern: pattern, user_id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message_code == 10) {
        alert(
          "We need to collect some typing data from you. You may be asked to fill out this form multiple times."
        );
        window.location.href = "/typing-patterns";
      } else {
        if (data.high_confidence == 1) {
          alert(
            "TypingDNA indicated that there was HIGH confidence in your login."
          );
        } else {
          alert(
            "TypingDNA indicated that there was LOW confidence in your login."
          );
        }
        window.location.href = "/";
      }
    });
  tdna.reset();
}
