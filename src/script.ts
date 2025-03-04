const searchForm = document.getElementById("search-form") as HTMLElement;

const userSearch = document.getElementById("user-search") as HTMLInputElement;

const dynamicOutput = document.querySelector(".dynamic-output") as HTMLElement;

const container = document.querySelector(".container") as HTMLElement;

// Set Object's Type

interface gitUser {
  login: string;

  avatar_url: string;

  url: string;
}

// Reuseable Fetch Functionality

const fetchFunctionality = async <gen>(url: string): Promise<gen> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Problem In Network Response. Error Code - ${response.status}`
    );
  }

  const fetchedData = await response.json();

  return fetchedData;
};

// Show Final Result Function

const showResults = (element: gitUser) => {
  const { login, avatar_url, url } = element;

  dynamicOutput.insertAdjacentHTML(
    "beforeend",
    `<div class="git-users-outer-box">
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
      </div>`
  );
};

// Define Load Function

const fetchUserData = async (url: string) => {
  const fetchedAllData = await fetchFunctionality<gitUser[]>(url);

  fetchedAllData.forEach((element) => {
    showResults(element);
  });
};

// Call Default Load Function

fetchUserData("https://api.github.com/users");

// Implementing Debouncing

const debounceFunc = (searchedResultShow: Function, delay: number) => {
  let timer: number;
  const functionality = (event: any) => {
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

const searchedResultShow = async (event: any) => {
  event.preventDefault();

  const userSearchedData = userSearch.value.toLowerCase();

  try {
    const apiUrl = "https://api.github.com/users";

    const fetchedAllData = await fetchFunctionality<gitUser[]>(apiUrl);

    const matchedUserData = fetchedAllData.filter((element) => {
      return element.login.toLowerCase().includes(userSearchedData);
    });

    dynamicOutput.innerHTML = "";

    const emptyMsg = container.querySelector(".empty-msg") as HTMLElement;

    if (emptyMsg) {
      emptyMsg.remove();
    }

    if (matchedUserData.length === 0) {
      container.insertAdjacentHTML(
        "beforeend",
        `<h1 class="empty-msg">No matching users found.</h1>`
      );
    } else {
      matchedUserData.forEach((element) => {
        showResults(element);
      });
    }
  } catch (error) {
    alert(error);
  }
};

const debounceImplemented = debounceFunc(searchedResultShow, 500);

searchForm.addEventListener("keyup", debounceImplemented);
