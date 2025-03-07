"use strict";
const searchForm = document.getElementById("search-form");
const userSearch = document.getElementById("user-search");
const dynamicOutput = document.querySelector(".dynamic-output");
const container = document.querySelector(".container");
// Reuseable Fetch Functionality
const fetchFunctionality = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Problem In Network Response. Error Code - ${response.status}`);
    }
    const fetchedData = await response.json();
    return fetchedData;
};
// Show Final Result Function
const showResults = (element) => {
    const { login, avatar_url, url } = element;
    dynamicOutput.insertAdjacentHTML("beforeend", `<div class="git-users-outer-box">
            <div class="git-users-inner-box">
              <div class="git-users-box flex-box">
                <div class="upper-part-info flex-box">
                  <div class="upper-user-img flex-box">
                  <img class="git-user-pic" src="${avatar_url}" alt= "${login}" />
                  </div>
                  <div>
                    <h1 class="git-username">${login}</h1>
                    <hr />
                  </div>
                </div>
                <div class="lower-part-info flex-box">
                  <div class="circle-user-img flex-box">
                    <img class="git-user-pic" src="${avatar_url}" alt= "${login}" />
                  </div>
                  <a href = "${url}" target= "_blank">Github</a>
                </div>
              </div>
            </div>
      </div>`);
};
// Define Load Function
const fetchUserData = async (url) => {
    const fetchedAllData = await fetchFunctionality(url);
    fetchedAllData.forEach((element) => {
        showResults(element);
    });
};
// Call Default Load Function
fetchUserData("https://api.github.com/users");
// Implementing Debouncing
const debounceFunc = (searchedResultShow, delay) => {
    let timer;
    const functionality = (event) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            searchedResultShow(event);
        }, delay);
    };
    return functionality;
};
// Search Functionality
const searchedResultShow = async (event) => {
    event.preventDefault();
    const userSearchedData = userSearch.value.toLowerCase();
    try {
        const apiUrl = "https://api.github.com/users";
        const fetchedAllData = await fetchFunctionality(apiUrl);
        const matchedUserData = fetchedAllData.filter((element) => {
            return element.login.toLowerCase().includes(userSearchedData);
        });
        dynamicOutput.innerHTML = "";
        const emptyMsg = container.querySelector(".empty-msg");
        if (emptyMsg) {
            emptyMsg.remove();
        }
        if (matchedUserData.length === 0) {
            container.insertAdjacentHTML("beforeend", `<h1 class="empty-msg">No matching users found.</h1>`);
        }
        else {
            matchedUserData.forEach((element) => {
                showResults(element);
            });
        }
    }
    catch (error) {
        alert(error);
    }
};
const debounceImplemented = debounceFunc(searchedResultShow, 500);
searchForm.addEventListener("keyup", debounceImplemented);
