export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isJSON(data) {
  try {
    JSON.stringify(data);
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

export function validJSON(json) {
  if (IsJsonString) {
    return true;
  }
  if (isJSON) {
    return true;
  }
  return false;
}

export function makeJSON(string) {
  try {
    if (!validJSON) {
      return false;
    } else {
      let json = string;

      while (typeof json == "string" && validJSON(json)) {
        json = JSON.parse(json);
      }
      return json;
    }
  } catch (e) {
    return false;
  }
}

//Modals
export async function askUser(title, text, closeOthers) {
  return new Promise((resolve, reject) => {
    //Create Modal container if doesnt exist
    let modalContainer = document.querySelector("#modalContainer");

    if (modalContainer == null) {
      modalContainer = document.createElement("div");
      modalContainer.setAttribute("id", "modalContainer");
      document.body.appendChild(modalContainer);
    }

    if (document.querySelector("#modalContainer") == null) {
      alert("no modal cóntainer found");
      reject();
    }
    let number = 1;
    // let modalsDiv = modalContainer.querySelectorAll(".modal-div");
    // if (modalsDiv.length > 0) {

    // }
    // console.log(modalsDiv);
    // console.log("Number of Modal Divs", number);
    let modals = modalContainer.querySelectorAll(".modal");
    console.log(modals);
    if (modals.length > 0) {
      number = modals.length + 1;
      if (closeOthers) {
        hideAllModals(closeOthers);
      }
    }
    console.log("Number of Modals", number);

    let modalOuter = document.createElement("div");
    modalOuter.classList.add("modal-div");
    modalOuter.setAttribute("id", number);
    modalContainer.appendChild(modalOuter);

    let modalHTML = `
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
        </div>
        <div class="modal-body">
          <div class="description">
            ${text}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" id="no">Nein</button>
          <button type="button" class="btn btn-success" id="yes">Ja</button>
        </div>
      </div>
    </div>
    </div>
     `;

    modalOuter.innerHTML = modalHTML;
    let modal = modalOuter.querySelector(".modal");

    let close = modal.querySelector("#close");
    let yes = modal.querySelector("#yes");
    let no = modal.querySelector("#no");

    var myModal = new bootstrap.Modal(modal);
    myModal.show();

    yes.addEventListener("click", (target) => {
      myModal.hide();

      hideAllModals(closeOthers);
      modalOuter.remove();
      resolve(true);
    });

    no.addEventListener("click", (target) => {
      myModal.hide();

      hideAllModals(closeOthers);
      modalOuter.remove();
      resolve(false);
    });

    close.addEventListener("click", (target) => {
      myModal.hide();
      hideAllModals(closeOthers);
      modalOuter.remove();
      resolve(false);
    });
  });
}

export function getUserInput(
  title,
  text,
  closeOthers,
  type = "text",
  placeholder = false,
  textContent = false,
  canBeEmpty = false,
  optionsToChooseFrom = new Object(),
  auswahlItem = false,
  fullscreen = false,
  options = false
) {
  return new Promise((resolve, reject) => {
    //Create Modal container if doesnt exist
    let modalContainer = document.querySelector("#modalContainer");

    if (modalContainer == null) {
      modalContainer = document.createElement("div");
      modalContainer.setAttribute("id", "modalContainer");
      document.body.appendChild(modalContainer);
    }

    if (document.querySelector("#modalContainer") == null) {
      alert("no modal cóntainer found");
      reject();
    }
    let number = 1;
    // let modalsDiv = modalContainer.querySelectorAll(".modal-div");
    // if (modalsDiv.length > 0) {

    // }
    // console.log(modalsDiv);
    // console.log("Number of Modal Divs", number);
    let modals = modalContainer.querySelectorAll(".modal");
    console.log(modals);
    if (modals.length > 0) {
      number = modals.length + 1;
      if (closeOthers) {
        hideAllModals(closeOthers);
      }
    }
    console.log("Number of Modals", number);

    let modalOuter = document.createElement("div");
    modalOuter.classList.add("modal-div");
    modalOuter.setAttribute("id", number);
    modalContainer.appendChild(modalOuter);

    if (type === "text") {
      let modalHTML = `
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog ${boolToString(fullscreen, {
      true: "modal-fullscreens",
      false: "",
    })}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
        </div>
        <div class="modal-body">
          <div class="description">
            <p>${text}</p>
            <input type="text" class="form-control" id="textInput"">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" id="no">Nein</button>
          <button type="button" class="btn btn-success" id="yes">Ja</button>
        </div>
      </div>
    </div>
    </div>
     `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let textInput = modal.querySelector("#textInput");

      if (textContent) {
        textInput.setAttribute("value", textContent);
      }
      if (placeholder) {
        textInput.setAttribute("placeholder", placeholder);
      }

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let value = textInput.value;
        if (canBeEmpty) {
          myModal.hide();
          hideAllModals(closeOthers);
          modalOuter.remove();
          resolve(value);
        } else {
          if (!isEmptyInput(value, false)) {
            myModal.hide();

            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(value);
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });
    } else if (type === "yes/no") {
      let modalHTML = `
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ${boolToString(fullscreen, {
          true: "modal-fullscreens",
          false: "",
        })}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
            </div>
            <div class="modal-body">
              <div class="description">
                <p>${text}</p>
                <select class="form-select" aria-label="Default select example" id="selectInput">
                    <option data-value="" selected="selected">Auswahl</option>
                    <option data-value="1" value="1">Ja</option>
                    <option data-value="0">Nein</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="no">Nein</button>
              <button type="button" class="btn btn-success" id="yes">Ja</button>
            </div>
          </div>
        </div>
        </div>
         `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let selectInput = modal.querySelector("#selectInput");

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let value =
          selectInput[selectInput.selectedIndex].getAttribute("data-value");
        if (canBeEmpty) {
          myModal.hide();
          hideAllModals(closeOthers);
          modalOuter.remove();
          resolve(value);
        } else {
          if (!isEmptyInput(value, true)) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(value);
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });
    } else if (type === "number") {
      let modalHTML = `
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ${boolToString(fullscreen, {
          true: "modal-fullscreens",
          false: "",
        })}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
            </div>
            <div class="modal-body">
              <div class="description">
                <p>${text}</p>
                <input type="number" id="numberInput" name="numberInput" min="0" autocomplete="off">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="no">Nein</button>
              <button type="button" class="btn btn-success" id="yes">Ja</button>
            </div>
          </div>
        </div>
        </div>
         `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let numberInput = modal.querySelector("#numberInput");
      if (textContent) {
        numberInput.setAttribute("value", textContent);
      }
      if (placeholder) {
        numberInput.setAttribute("placeholder", placeholder);
      }

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let value = numberInput.value;
        if (canBeEmpty) {
          myModal.hide();
          hideAllModals(closeOthers);
          modalOuter.remove();
          resolve(value);
        } else {
          if (!isEmptyInput(value, false)) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(value);
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });
    } else if (type === "select") {
      let modalHTML = `
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ${boolToString(fullscreen, {
          true: "modal-fullscreens",
          false: "",
        })}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
            </div>
            <div class="modal-body">
              <div class="description">
                <p>${text}</p>
                <select class="form-select" aria-label="Default select example" id="selectInput">
                   
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="no">Nein</button>
              <button type="button" class="btn btn-success" id="yes">Ja</button>
            </div>
          </div>
        </div>
        </div>
         `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let selectInput = modal.querySelector("#selectInput");
      selectInput.innerHTML = "";
      if (
        optionsToChooseFrom == false ||
        !Object.keys(optionsToChooseFrom).length
      ) {
        selectInput.innerHTML = "<option>Keine Einträge</option>";
      }
      if (auswahlItem) {
        let optionElement = document.createElement("option");
        optionElement.setAttribute("data-value", "");
        optionElement.innerHTML = "Auswahl";
        selectInput.appendChild(optionElement);
      }
      for (const [key, value] of Object.entries(optionsToChooseFrom)) {
        let optionElement = document.createElement("option");
        optionElement.setAttribute("data-value", value);
        optionElement.innerHTML = key;
        selectInput.appendChild(optionElement);
      }

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let value =
          selectInput[selectInput.selectedIndex].getAttribute("data-value");
        if (canBeEmpty) {
          myModal.hide();
          hideAllModals(closeOthers);
          modalOuter.remove();
          resolve(value);
        } else {
          if (!isEmptyInput(value, false)) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(value);
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        modalOuter.remove();
        hideAllModals(closeOthers);
        resolve(false);
      });
    } else if (type === "textArea") {
      let modalHTML = `
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ${boolToString(fullscreen, {
          true: "modal-fullscreen",
          false: "",
        })}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
            </div>
            <div class="modal-body">
              <div class="description">
                <p>${text}</p>
                <textarea class="form-control" id="textInput" rows="3">${
                  textContent ?? ""
                }</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="no">Nein</button>
              <button type="button" class="btn btn-success" id="yes">Ja</button>
            </div>
          </div>
        </div>
        </div>
         `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let textInput = modal.querySelector("#textInput");

      if (placeholder) {
        textInput.setAttribute("placeholder", placeholder);
      }

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let value = textInput.value;
        if (canBeEmpty) {
          myModal.hide();
          hideAllModals(closeOthers);
          modalOuter.remove();
          resolve(value);
        } else {
          if (!isEmptyInput(value, true)) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(value);
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });
    } else if (type === "file") {
      let modalHTML = `
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog ${boolToString(fullscreen, {
          true: "modal-fullscreens",
          false: "",
        })}">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
            </div>
            <div class="modal-body">
              <div class="description">
                <p>${text}</p>
              </div>
                <input type="file" id="fileInput" name="file" ${valueToString(
                  options.multiple,
                  { true: "multiple", false: "", undefined: "" }
                )}>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="no">Nein</button>
              <button type="button" class="btn btn-success" id="yes">Ja</button>
            </div>
          </div>
        </div>
        </div>
         `;
      modalOuter.innerHTML = modalHTML;
      let modal = modalOuter.querySelector(".modal");

      let textInput = modal.querySelector("#textInput");

      if (textContent) {
        textInput.setAttribute("value", textContent);
      }
      if (placeholder) {
        textInput.setAttribute("placeholder", placeholder);
      }

      let close = modal.querySelector("#close");
      let yes = modal.querySelector("#yes");
      let no = modal.querySelector("#no");

      var myModal = new bootstrap.Modal(modal);
      myModal.show();

      yes.addEventListener("click", (target) => {
        let files = modal.querySelector("#fileInput").files;
        if (options.multiple) {
          if (canBeEmpty) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            resolve(files);
          } else {
            if (!files.length > 0) {
              myModal.hide();
              hideAllModals(closeOthers);
              modalOuter.remove();
              resolve(files);
            }
          }
        } else {
          //only one file
          if (canBeEmpty) {
            myModal.hide();
            hideAllModals(closeOthers);
            modalOuter.remove();
            alert("current selected files", files);
            if (files.length > 0) {
              resolve(files[0]);
            }
            resolve(false);
          } else {
            if (files.length > 0) {
              myModal.hide();
              hideAllModals(closeOthers);
              modalOuter.remove();
              resolve(files[0]);
            }
          }
        }
      });

      no.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });

      close.addEventListener("click", (target) => {
        myModal.hide();
        hideAllModals(closeOthers);
        modalOuter.remove();
        resolve(false);
      });
    }
  });
}

export function createModal(
  options = {
    backdrop: "static",
    title: "Nachricht",
    fullscreen: true,
    scrollable: true,
    verticallyCentered: true,
    modalType: "ok | yes / no",
  }
) {
  let modalContainer = document.querySelector("#modalContainer");

  if (modalContainer == null) {
    modalContainer = document.createElement("div");
    modalContainer.setAttribute("id", "modalContainer");
    document.body.appendChild(modalContainer);
  }

  if (document.querySelector("#modalContainer") == null) {
    alert("no modal cóntainer found");
    reject();
  }
  let number = 1;
  let modals = modalContainer.querySelectorAll(".modal");
  console.log(modals);
  if (modals.length > 0) {
    number = modals.length + 1;
  }
  console.log("Number of Modals", number);

  let modalOuter = document.createElement("div");
  modalOuter.classList.add("modal-div");
  modalOuter.setAttribute("id", number);
  modalContainer.appendChild(modalOuter);
  let modalHTML = `
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="${valueToString()}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog ${valueToString(
      options?.scrollable,
      { true: "modal-dialog-scrollable" },
      true
    )} ${valueToString(
    Boolean(options?.fullscreen),
    { true: "modal-fullscreen" },
    true
  )}
    ${valueToString(
      options?.verticallyCentered,
      { true: "modal-dialog-centered" },
      true
    )}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">${
            options?.title ?? ""
          }</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
        </div>
        <div class="modal-body">
         
        </div>
        <div class="modal-footer">
          ${valueToString(
            options?.modalType,
            {
              true: "modal-dialog-scrollable",
              "yes/no": `<button type="button" class="btn btn-danger" id="no">Nein</button> <button type="button" class="btn btn-success" id="yes">Ja</button>`,
              ok: `<button type="button" class="btn btn-secondary" id="ok">OK</button>`,
              false: `<button type="button" class="btn btn-secondary" id="ok">OK</button>`,
            },
            true
          )}
         
        </div>
      </div>
    </div>
    </div>
     `;
  modalOuter.innerHTML = modalHTML;
  let modal = modalOuter.querySelector(".modal");
  let bootstrapModal = new bootstrap.Modal(modal);
  return {
    modal,
    bootstrapModal: bootstrapModal,
    modalBody: modal.querySelector(".modal-body"),
    modalOuter,
  };
}

export function alertUser(title, text, closeOthers) {
  return new Promise(async (resolve, reject) => {
    const createdModal = createModal({
      title: title,
      fullscreen: false,
      verticallyCentered: false,
      modalType: "ok",
    });
    const modal = createdModal.modal;
    const bootstrapModal = createdModal.bootstrapModal;
    const modalBody = createdModal.modalBody;
    const modalOuter = createdModal.modalOuter;

    modalBody.innerHTML = text;
    bootstrapModal.show();
    popUpStatus(true);
    let ok = modal.querySelector("#ok");
    ok.addEventListener("click", (target) => {
      bootstrapModal.hide();
      hideAllModals(closeOthers);
      modalOuter.remove();
      popUpStatus(false);
      resolve(true);
    });
    let close = modal.querySelector("#close");
    close.addEventListener("click", (target) => {
      bootstrapModal.hide();
      hideAllModals(closeOthers);
      modalOuter.remove();
      popUpStatus(false);
      resolve(false);
    });
  });
}

export function createToast() {
  let toastContainer = document.querySelector(".toast-container");

  if (toastContainer == null) {
    toastContainer = document.createElement("div");
    toastContainer.classList =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
    console.log(toastContainer);
  }

  if (!document.querySelector(".toast-container")) {
    alert("no toast container found");
    return false;
  }
  let number = 1;
  let toasts = toastContainer.querySelectorAll(".toast");
  console.log(toasts);
  if (toasts.length > 0) {
    number = toasts.length + 1;
  }
  console.log("Number of Toasts", number);

  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.setAttribute("id", number);
  toastContainer.appendChild(toast);
  return toast;
}

export function editObject(
  object,
  options = {
    backdrop: "static",
    title: "Nachricht",
    fullscreen: true,
    scrollable: true,
    verticallyCentered: true,
    modalType: "ok | yes / no",
  },
  includeValueMultiple = false,
  editKey = false
) {
  return new Promise((resolve, reject) => {
    const createdModal = createModal(options);
    const modal = createdModal.modal;
    const bootstrapModal = createdModal.bootstrapModal;
    const modalBody = createdModal.modalBody;
    const modalOuter = createdModal.modalOuter;

    bootstrapModal.show();

    modalBody.innerHTML = `
      ${options?.text ?? ""}
      <div id="editObject">
        <div class="header">
          <input type="text" class="form-control textInput" autocomplete="off">
          <button type="button" class="btn btn-primary btn-sm submitBtn">Hinzufügen</button>
          <button type="button" class="btn btn-info btn-sm reloadBtn">Neuladen</button>
        </div>
        
        <div class="main"></div>
      </div>
      `;

    let editObjectList = modalBody.querySelector("#editObject .main");
    let submitBtn = modalBody.querySelector("#editObject .header .submitBtn");
    let textInput = modalBody.querySelector("#editObject .header .textInput");
    submitBtn.addEventListener("click", () => {
      object[Number(Object.keys(object).length) + 1] = textInput.value;
      update();
    });
    let reloadBtn = modalBody.querySelector("#editObject .header .reloadBtn");
    reloadBtn.addEventListener("click", () => {
      update();
    });
    let update = () => {
      editObjectList.innerHTML = "";
      if (!object) object = new Object();
      if (includeValueMultiple) {
        object = { ...Set(object) };
      }
      if (!Object.entries(object) > 0) {
        editObjectList.innerText = "Leer";
        return;
      }
      for (const [key, value] of Object.entries(object)) {
        console.log("key", key, "value", value);
        let item = document.createElement("div");
        item.classList.add("item", "row");
        editObjectList.appendChild(item);
        item.innerHTML = `
            <input type="text" class="textInput col-2" id="key" autocomplete="off" value="${key}">
            <input type="text" class="col-9" id="value" autocomplete="off" value="${value}">
            <button class="btn btn-danger remove col-1">X</button>
          `;

        let keyTextInput = item.querySelector("#key");
        if (editKey) {
          keyTextInput.addEventListener("input", () => {
            delete object[key];
            object[keyTextInput] = keyTextInput.value;
          });
        } else {
          keyTextInput.disabled = true;
        }

        let valueTextInput = item.querySelector("#value");
        valueTextInput.addEventListener("input", () => {
          object[key] = valueTextInput.value;
        });

        let remove = item.querySelector(".remove");
        remove.addEventListener("click", () => {
          delete object[key];
          update();
        });
      }
    };
    update();

    let ok = modal.querySelector("#ok");
    ok.addEventListener("click", (target) => {
      bootstrapModal.hide();
      modalOuter.remove();
      resolve(makeJSON(JSON.stringify(object)));
    });
    let close = modal.querySelector("#close");
    close.addEventListener("click", (target) => {
      bootstrapModal.hide();
      modalOuter.remove();
      resolve(makeJSON(JSON.stringify(object)));
    });
  });
}

export function hideAllModals(check) {
  if (check) {
    let number = 0;
    let modals = document.querySelector("#modalContainer .modal");
    console.log(modals);
    if (modals && modals.length > 0) {
      for (const element of modals) {
        var myModal = bootstrap.Modal.getOrCreateInstance(element); // Returns a Bootstrap modal instance
        myModal.dispose();
        element.parentElement.remove();
      }
      return true;
    }
  } else {
    return false;
  }
}

export async function hideAllToasts(check) {
  if (check) {
    let number = 0;
    let toasts = document.querySelector(".toast-container .toast");
    console.log(toasts);
    if (toasts && toasts.length > 0) {
      for (const element of toasts) {
        var myToast = bootstrap.Toast.getOrCreateInstance(element); // Returns a Bootstrap toast instance
        myToast.dispose();
        element.remove();
      }
      return true;
    }
  } else {
    return false;
  }
}

export async function popUpStatus(status = true) {
  if (status) {
    sessionStorage.setItem("popupOpen", true);
  } else {
    sessionStorage.setItem("popupOpen", false);
  }
}

export async function fetchData(...options) {
  return new Promise((resolve, reject) => {
    fetch(...options)
      .then(async (response) => {
        let json = await response.json();
        if (json.error) {
          resolve(false);
          console.error(json);
          return;
        }
        resolve(json);
      })
      .catch((response) => {
        console.error(response);
        reject(false);
      });
  });
}

export function limitArray(arr, maxNumber) {
  if (!maxNumber > 0) {
    return arr;
  }
  var arrLength = arr.length;
  if (arrLength > maxNumber) {
    arr.splice(0, arrLength - maxNumber);
  }
  return arr;
}

export function valueToString(
  value,
  data = { true: "Ja", false: "Nein" },
  emptyStringIfEmpty = false
) {
  if (emptyStringIfEmpty) {
    if (!data[value] || isEmptyInput(data[value])) {
      return "";
    }
    return data[value];
  } else {
    return data[value] ?? value;
  }
}

export function isEmptyInput(input, strictmode = false) {
  if (strictmode) {
    if (input === "" || input === false || input.trim().length == 0) {
      return true;
    }
  } else {
    if (input === "" || input == false || input.trim().length == 0) {
      return true;
    }
  }

  return false;
}

export function secondsToArrayOrString(
  seconds,
  StringOrArray = "String",
  options = {
    wordspelling: {
      seconds: { singular: "Sek", plural: "Sek" },
      minutes: { singular: "Min", plural: "Min" },
      hours: { singular: "h", plural: "h" },
      days: { singular: "d", plural: "d" },
      years: { singular: "Y", plural: "Y" },
    },
    empty: "0",
  },
  logConsole = false
) {
  seconds = Number(seconds);

  let yearsRemaining = Math.floor(seconds / (60 * 60 * 24 * 365));
  let daysRemaining = Math.floor((seconds / (60 * 60 * 24)) % 365);
  let hoursRemaining = Math.floor((seconds / (60 * 60)) % 24);
  let minutesRemaining = Math.floor((seconds / 60) % 60);
  let secondsRemaining = Math.floor(seconds % 60);

  if (logConsole)
    console.log({
      years: yearsRemaining,
      days: daysRemaining,
      hours: hoursRemaining,
      minutes: minutesRemaining,
      secondsRemaining,
    });

  if (StringOrArray === "Array") {
    return {
      years: yearsRemaining,
      days: daysRemaining,
      hours: hoursRemaining,
      minutes: minutesRemaining,
      seconds: secondsRemaining,
    };
  } else {
    let string = "";
    //Years
    if (yearsRemaining > 0 && yearsRemaining == 1)
      string = `${string} ${yearsRemaining} ${options?.wordspelling?.years.singular}`;
    if (yearsRemaining > 0 && yearsRemaining > 1)
      string = `${string} ${yearsRemaining} ${options?.wordspelling?.years.plural}`;
    //Days
    // console.log("1", string);
    if (daysRemaining > 0 && daysRemaining == 1)
      string = `${string} ${daysRemaining} ${options?.wordspelling?.days.singular}`;
    if (daysRemaining > 0 && daysRemaining > 1)
      string = `${string} ${daysRemaining} ${options?.wordspelling?.days.plural}`;
    //Hours
    // console.log("2", string);
    if (hoursRemaining > 0 && hoursRemaining == 1)
      string = `${string} ${hoursRemaining} ${options?.wordspelling?.hours.singular}`;
    if (hoursRemaining > 0 && hoursRemaining > 1)
      string = `${string} ${hoursRemaining} ${options?.wordspelling?.hours.plural}`;
    //Minutes
    // console.log("3", string);
    if (minutesRemaining > 0 && minutesRemaining == 1)
      string = `${string} ${minutesRemaining} ${options?.wordspelling?.minutes.singular}`;
    if (minutesRemaining > 0 && minutesRemaining > 1)
      string = `${string} ${minutesRemaining} ${options?.wordspelling?.minutes.plural}`;
    //Seconds
    // console.log("4", string);
    if (secondsRemaining > 0 && secondsRemaining == 1)
      string = `${string} ${secondsRemaining} ${options?.wordspelling?.seconds.singular}`;
    if (secondsRemaining > 0 && secondsRemaining > 1)
      string = `${string} ${secondsRemaining} ${options?.wordspelling?.seconds.plural}`;
    // console.log("5", string)

    if (isEmptyInput(string)) {
      return options?.empty ?? "";
    }
    return string;
  }
}

export function getUrlParams(queryString = false) {
  if (!queryString) {
    queryString = window.location.search;
  }
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

export function insertUrlParam(key, value) {
  if (history.pushState) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    let newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.pushState({ path: newurl }, "", newurl);
  }
}

// to remove the specific key
export function removeUrlParameter(paramKey) {
  const url = window.location.href;
  console.log("url", url);
  var r = new URL(url);
  r.searchParams.delete(paramKey);
  const newUrl = r.href;
  console.log("r.href", newUrl);
  window.history.pushState({ path: newUrl }, "", newUrl);
}

export async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation.getCurrentPosition) {
      console.error("Your brower doesnt support navigator.geolocation.getCurrentPosition()");
       resolve(false);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
       resolve(position);
      },
      (error) => {
        console.error({ error });
         resolve(false);
      },
      { enableHighAccuracy: true }
    );
  })
  
}

export function showClock(element, options = {
  hour: "digit",
  minute: "digit",
  second: "digit"
}, updateInterval = 1000) {
  //options: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
  function updateTime() {
    let date = new Date();
    element.innerText = `${date.toLocaleDateString(undefined, options)}`;
  }
  updateTime();
  return window.setInterval(updateTime, updateInterval);
}

export function stopClock(clock) {
  return window.clearInterval(clock);
}



export function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export function removeAllEventlisteners(element) {
  if (!element) {
    return element;
  }
  // Make a copy
  var copy = element.cloneNode(true);
  //Replace
  element.replaceWith(copy);
  return copy;
}