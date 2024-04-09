$(document).ready(() => {
  console.log("Подключен");
  let selectedUserId;
  let selectedUserAddress;
  let selectedUserPassword;
  let userAddressFirst = "3Npmo2swkWoLmSs4TNk6SJjvK7cgvGxi4n7";
  let userAddressSecond = "3Nuqp5J1ipToQZNBjva5ZpoTe5ioMTCHqJp";
  let userAddressThird = "3NjB8ZQVsMsDWbXMBXZiYtqhCBbdEySAZJF";
  let thirdAccountCID;
  let contractId;
  let firstAccountCID;
  let secondAccountCID;
  $("#getContractId__btn").click(() => {
    let image = $("#image-docker").val();
    let imageHash = $("#image-hash-docker").val();
    let transaction = {
      image: image,
      fee: 0,
      imageHash: imageHash,
      type: 103,
      params: [
        {
          type: "string",
          value: "initRent",
          key: "action",
        },
      ],
      version: 2,
      sender: selectedUserAddress,
      password: selectedUserPassword,
      contractName: "confident",
    };

    console.log(selectedUserId);
    console.log(selectedUserPassword);
    console.log(image);
    console.log(imageHash);
    fetch(`http://localhost:${selectedUserId}/transactions/signAndBroadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    })
      .then((response) => {
        response.json().then((data) => {
          console.log(data.id);
          $("#contactId-text").text(`Айди контракта : ${data.id}`);
          contractId = data.id;
          localStorage.setItem("contractId", data.id);
          alert("Ожидайте ~15 секунд пока контракт задеплоится");
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  function getState() {
    let requestedData = {
      contracts: [contractId],
    };
    fetch(`http://localhost:${selectedUserId}/contracts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestedData),
    })
      .then((response) => {
        response.json().then((data) => {
          console.log("Дата получена");
          let companyBlock = $(".companies-list");
          let applicationBlock = $(".applications-list");
          let productsBlock = $(".products-list");
          let cardsBlock = $(".cards-list");
          companyBlock.empty();
          applicationBlock.empty();
          productsBlock.empty();
          cardsBlock.empty();
          for (let i = 0; i < data[contractId].length; i++) {
            let dataValue = data[contractId][i].value;
            let dataObject = JSON.parse(dataValue);
            if (dataObject.addressApplication) {
              applicationBlock.append(
                $(`<div class="application">
            <p>Адрес/ключ : ${dataObject.addressApplication}</p>
              <p>Контактные данные : ${dataObject.contactDataApplication}</p>
              <p>ФИО :  ${dataObject.fioApplication}</p>
              <p>Имя компании :  ${dataObject.companyNameApplication}</p>
              <p>Описание компании :  ${dataObject.companyDescrApplication}</p>
              <p>Роль :  ${dataObject.roleApplication}</p>
              <p>Подтверждение? true или false :  ${dataObject.confirmApplication}</p>
              <p>Регионы :  ${dataObject.regionsApplication}</p>
            </div>`)
              );
            }
            if (dataObject.productNameProduct) {
              productsBlock.append(
                $(`<div class="product">
               <p>Имя продукта : ${dataObject.productNameProduct}</p>
               <p>Описание продукта : ${dataObject.productDescrProduct}</p>
               <p>Подтверждение продукта true или false : ${dataObject.confirmProduct}</p>
               <p>Регионы продукта : ${dataObject.regionsProduct}</p>
               <p>Минимальный обьем : ${dataObject.minValueProduct}</p>
               <p>Максимальный обьем : ${dataObject.maxValueProduct}</p>
               <p>Адрес поставщика : ${dataObject.providerAddressProduct}</p>
      
              </div>`)
              );
            }
            if (dataObject.productNameCard) {
              cardsBlock.append(
                $(`<div class="card">
                <p>Имя продукта в заказе : ${dataObject.productNameCard}</p>
                 <p>Обьем : ${dataObject.volumeCard}</p>
                  <p>Желаемая дата доставки : ${dataObject.wantedDateCard}</p>
                   <p>Ключ/Адрес продавца : ${dataObject.sellerAddressCard}</p>
                    <p>Имя компании продавца : ${dataObject.sellerCompanyNameCard}</p>
                     <p>Адрес доставки : ${dataObject.deliveryAddressCard}</p>
                      <p>Подтвержденная дата: ${dataObject.confirmedDateCard}</p>
                       <p>Условия оплаты : ${dataObject.paymentRulesCard}</p>
                        <p>Ключ/Адрес покупателя : ${dataObject.buyerAddressCard}</p>
                         <p>Статус карточки заказа : ${dataObject.statusCard}</p>
              </div>`)
              );
            }
          }
        });
      })
      .catch((error) => {
        console.error(error);
        alert(
          "Такого контракта либо еще нету либо он еще не обработался, попробуйте позже еще раз"
        );
      });
  }
  $("#confirmRegister_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "confirmApplication",
            key: "action",
          },
          {
            type: "string",
            key: "address",
            value: $("#address_confirm").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы");
    }
  });

  $("#createProduct_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "registerProduct",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_createProduct").val(),
          },
          {
            type: "string",
            key: "productDescr",
            value: $("#productDescr_createProduct").val(),
          },
          {
            type: "string",
            key: "productRegions",
            value: $("#regions_createProduct").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            alert("Ожидайте выполнения транзакции ~30 секунд");
            getState();
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#confirmProduct_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "confirmProduct",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_confirmProduct").val(),
          },
          {
            type: "string",
            key: "providerAddress",
            value: $("#providerAddress_confirmProduct").val(),
          },
          {
            type: "string",
            key: "minValue",
            value: $("#minValue_confirmProduct").val(),
          },
          {
            type: "string",
            key: "maxValue",
            value: $("#maxValue_confirmProduct").val(),
          },
          {
            type: "string",
            key: "sellerAddreses",
            value: $("#sellerAdresses_confirmProduct").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#createCard_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "registerCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_createCard").val(),
          },
          {
            type: "string",
            key: "volume",
            value: $("#volume_createCard").val(),
          },
          {
            type: "string",
            key: "wantedDate",
            value: $("#wantedDate_createCard").val(),
          },
          {
            type: "string",
            key: "deliveryAddress",
            value: $("#delivery_createCard").val(),
          },
          {
            type: "string",
            key: "sellerAddress",
            value: $("#sellerAddress_createCard").val(),
          },
          {
            type: "string",
            key: "sellerCompanyName",
            value: $("#sellerCompany_createCard").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#allowCard_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "allowCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_allowCard").val(),
          },
          {
            type: "string",
            key: "clientAddress",
            value: $("#clientAddress_allowCard").val(),
          },
          {
            type: "string",
            key: "confirmedDate",
            value: $("#confirmedDate_allowCard").val(),
          },
          {
            type: "string",
            key: "paymentRules",
            value: $("#payment-rules").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#confirm_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "confirmCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_confirmCard").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#rejectCard_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "rejectCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_reject").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#payCard_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "payCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_pay").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });
  $("#getCard_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "getCard",
            key: "action",
          },
          {
            type: "string",
            key: "productName",
            value: $("#productName_get").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });

  $("#register_btn").click(() => {
    if (selectedUserPassword && contractId) {
      let transaction = {
        contractId: contractId,
        fee: 0,
        type: 104,
        params: [
          {
            type: "string",
            value: "registerApplication",
            key: "action",
          },
          {
            type: "string",
            key: "companyName",
            value: $("#companyName_register").val(),
          },
          {
            type: "string",
            key: "companyDescr",
            value: $("#companyDescr_register").val(),
          },
          {
            type: "string",
            key: "role",
            value: $("#role_register").val(),
          },
          {
            type: "string",
            key: "regions",
            value: $("#regions_register").val(),
          },
          {
            type: "string",
            key: "fio",
            value: $("#fio_register").val(),
          },
          {
            type: "string",
            key: "contactData",
            value: $("#contactData_register").val(),
          },
        ],
        version: 2,
        sender: selectedUserAddress,
        password: selectedUserPassword,
        contractVersion: 1,
      };

      fetch(
        `http://localhost:${selectedUserId}/transactions/signAndBroadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      )
        .then((response) => {
          response.json().then((data) => {
            getState();
            alert("Ожидайте выполнения транзакции ~30 секунд");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Вы не авторизованы или не вошли в контракт");
    }
  });

  $("#setPreviusContractId").click(() => {
    if (selectedUserPassword) {
      contractId = localStorage.getItem("contractId");
      $("#contactId-text").text(`Айди контракта : ${contractId}`);
      getState();
      alert("Вы авторизировались в последний зайденный вами контракт");
      setInterval(() => {
        getState();
      }, 5000);
    } else {
      alert("Введите пароль и ключевую фразу");
    }
  });
  $("#setContractId__btn").click(() => {
    contractId = $("#contractId").val();
    localStorage.setItem("contractId", contractId);
    alert("Вы зашли в контракт");
    getState();
    setInterval(() => {
      getState();
    }, 5000);
  });
  $(".companies-block").hide();
  $(".applications-block").hide();
  $(".product-block").hide();
  $(".cards-block").hide();
  $("#show_companies").click(() => {
    $(".companies-block").toggle();
  });
  $("#show_products").click(() => {
    $(".product-block").toggle();
  });
  $("#show_cards").click(() => {
    $(".cards-block").toggle();
  });
  $("#show_applications").click(() => {
    $(".applications-block").toggle();
  });

  $("#choose-user__select").change(() => {
    let value = $("#choose-user__select").val();
    selectedUserAddress = value;
    if (value == userAddressFirst) selectedUserId = "6862";
    if (value == userAddressSecond) selectedUserId = "6872";
    if (value == userAddressThird) selectedUserId = "6882";
    console.log(selectedUserAddress);

    alert("Введите пароль");
  });
  $("#authorize__btn").click(() => {
    if (localStorage.getItem("selectedUserPassword")) {
      if (
        localStorage.getItem("selectedUserPassword") != $("#user-CID").val()
      ) {
        alert("Кодовая фраза не правильная");
      } else {
        selectedUserPassword = $("#user-password").val();
        alert("Вы авторизовались ");
      }
    } else {
      localStorage.setItem("selectedUserPassword", $("#user-CID").val());
      selectedUserPassword = $("#user-password").val();
      alert("Вы авторизовались");
    }
  });
  $("#choose-user__select").append(
    $(
      `<option class= "user__option" value="${userAddressFirst}">${userAddressFirst}</option>
      <option class= "user__option" value="${userAddressSecond}">${userAddressSecond}</option>
      <option class= "user__option" value="${userAddressThird}">${userAddressThird}</option>`
    )
  );
});
