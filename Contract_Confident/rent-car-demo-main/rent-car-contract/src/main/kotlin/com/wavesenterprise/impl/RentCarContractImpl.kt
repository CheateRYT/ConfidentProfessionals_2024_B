package com.wavesenterprise.impl

import com.wavesenterprise.api.RentCarContract
import com.wavesenterprise.domain.Application
import com.wavesenterprise.domain.Card
import com.wavesenterprise.domain.Company
import com.wavesenterprise.domain.Product
import com.wavesenterprise.sdk.contract.api.annotation.ContractHandler
import com.wavesenterprise.sdk.contract.api.domain.ContractCall
import com.wavesenterprise.sdk.contract.api.state.ContractState
import com.wavesenterprise.sdk.contract.api.state.mapping.Mapping
import com.wavesenterprise.sdk.contract.core.state.getValue

@ContractHandler
class RentCarContractImpl(
    val contractState: ContractState,
    val call: ContractCall,
) : RentCarContract {

    val products: Mapping<Product> by contractState
    val cards: Mapping<Card> by contractState
    val applications: Mapping<Application> by contractState
    val companies: Mapping<Company> by contractState

    //Функция для деплоя контракта на ноду
    override fun initRent() {
        val creatorAddress: String = call.sender.asBase58String()
    }

    //Функция для регистрации карточки продукта может вызвать только поставщик, принимает имя продукта, описание продукта, и регионы в которые он поставляется
    //Возвращает структуру в маппинге с продуктом по ключу  создателя и имени продукта
    override fun registerProduct(productName: String, productDescr: String, productRegions: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (applications.tryGet(creatorAddress).get().roleApplication == "provider" && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val confirmFalse = "false".toString()
            products.put(
                creatorAddress +
                        productName, Product(
                    productName, productDescr, confirmFalse, productRegions.split(","), "", "",
                    creatorAddress,listOf()
                )
            )
        }
    }

    //Функция для подтверждения продукта, может вызвать только оператор принимает имя продукта, ключ создателя продукта,
    // минимальное количество, максимальное количество, ключи дистрибуторов или операторов через запятую, которые могут продовать товар
    //Возвращает изменненую структуру продукта в маппинге
    override fun confirmProduct(
        productName: String,
        providerAddress: String,
        minValue: String,
        maxValue: String,
        sellerAddreses: String
    ) {
        val creatorAddress: String = call.sender.asBase58String()
        if (applications.tryGet(creatorAddress).get().roleApplication == "operator"
        ) {
            val confirmTrue = "true".toString()
            val product = products.tryGet(providerAddress + productName).get()
            product.confirmProduct = confirmTrue;
            product.minValueProduct = minValue;
            product.maxValueProduct = maxValue;
            product.selllerAddressesProduct = sellerAddreses.split(',')
            products.put(providerAddress + productName, product)
        }
    }

    //Функция для регистрации пользователя, принимает имя организации, описание компании, роль регионы через запятую, фио, контактные данные
    //Возвращает структуру пользователя в маппинге не подтвержденную
    override fun registerApplication(
        companyName: String,
        companyDescr: String,
        role: String,
        regions: String,
        fio: String,
        contactData: String
    ) {
        val confirmFalse = "false".toString()
        val creatorAddress: String = call.sender.asBase58String()
        applications.put(
            creatorAddress, Application(
                fio, contactData, creatorAddress, companyName, companyDescr, role, confirmFalse, regions.split(","),
                listOf()
            )
        )
    }

    //Функция для подтверждения заявки на регистрацию, вызвать может только оператор,
    // принимает ключ человека который регистрировался, возвращает изменненую структуру пользователя подтвержденную
    //И создают структуру компании по ключу ее имени или если она существует просто добавляет туда ключ работника
    override fun confirmApplication(address: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (applications.tryGet(creatorAddress).get().roleApplication == "operator"
        ) {
            val confirmTrue = "true".toString()
            val application = applications.tryGet(address).get()
            application.confirmApplication = confirmTrue;
            applications.put(address, application);

        }
    }

    //Функция для регистрации карточки заказа, принимает имя продукта, обьем покупки, желаемую дату поставки, адрес доставки
    //ключ человека у кого хотите купить и его имя компании
    //создает и возвращает структуру этой карточки заказа в маппинге с не подтвержденным статусом
    override fun registerCard(
        productName: String,
        volume: String,
        wantedDate: String,
        deliveryAddress: String,
        sellerAddress: String,
        sellerCompanyName: String
    ) {
        val creatorAddress: String = call.sender.asBase58String();
        if (products.tryGet(sellerAddress + productName).get().confirmProduct == "true") {
            val statusCreated = "Карточка товара создана но не подтверждена".toString()
            cards.put(
                creatorAddress + productName,
                Card(
                    productName,
                    volume,
                    wantedDate,
                    sellerAddress,
                    sellerCompanyName,
                    deliveryAddress,
                    "",
                    "",
                    creatorAddress,
                    statusCreated
                )
            )
        }
    }

    //Функция для подтверждения карточки заказа, может вызвать только продавец, принимает имя товара, ключ клиента, подтвержденную дату,
    //И условия оплаты. Возвращает измененную структуру карточки заказа со статусом Ожидает подтверждения клиента
    override fun allowCard(productName: String, clientAddress: String, confirmedDate: String, paymentRules: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (cards.tryGet(clientAddress + productName).get().sellerAddressCard == creatorAddress && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val waitingStatus = "Ожидает подтверждения клиента".toString();
            val card = cards.tryGet(clientAddress + productName).get()
            card.statusCard = waitingStatus;
            card.confirmedDateCard = confirmedDate;
            card.paymentRulesCard = paymentRules;
            cards.put(clientAddress + productName, card)
        }
    }

    //Функция для одобрения карточки заказа, может вызвать только покупатель, принимает имя продукта
    //Возвращает структуру карточки заказа в маппинге с измененным статусом зависящим от условий оплаты
    //Если предоплата то статус Ожидает оплаты
    //Если оплата не предусмотрена то статус Исполняется
    override fun confirmCard(productName: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (cards.tryGet(creatorAddress + productName).get().buyerAddressCard == creatorAddress && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val card = cards.tryGet(creatorAddress + productName).get()
            if (card.paymentRulesCard == "Предоплата") {
                val waitingPredoplataStatus = "Ожидает оплаты".toString()
                card.statusCard = waitingPredoplataStatus
                cards.put(creatorAddress + productName, card);
            } else {
                val doingStatus = "Исполняется".toString();
                card.statusCard = doingStatus;
                cards.put(creatorAddress + productName, card);
            }
        }
    }

    //Функция для отказа карточки заказа, может вызвать только покупатель, принимает имя продукта
    //Возвращает структуру карточки заказа в маппинге с измененным статусом Отклонена
    override fun ejectCard(productName: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (cards.tryGet(creatorAddress + productName).get().buyerAddressCard == creatorAddress && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val card = cards.tryGet(creatorAddress + productName).get()
            val ejectStatus = "Отклонена".toString()
            card.statusCard = ejectStatus
            cards.put(creatorAddress + productName, card);
        }
    }

    //Функция для указания что заказ оплачен, может вызвать только покупатель, принимает имя продукта
    //Возвращает структуру карточки заказа в маппинге с измененным статусом Оплачено
    override fun payCard(productName: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (cards.tryGet(creatorAddress + productName).get().buyerAddressCard == creatorAddress && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val card = cards.tryGet(creatorAddress + productName).get()
            val buyStatus = "Оплачено".toString()
            card.statusCard = buyStatus
            cards.put(creatorAddress + productName, card);
        }
    }

    //Функция для указания что заказ получен, может вызвать только покупатель, принимает имя продукта
    //Возвращает структуру карточки заказа в маппинге с измененным статусом Получено
    override fun getCard(productName: String) {
        val creatorAddress: String = call.sender.asBase58String()
        if (cards.tryGet(creatorAddress + productName).get().buyerAddressCard == creatorAddress && applications.tryGet(
                creatorAddress
            ).get().confirmApplication == "true"
        ) {
            val card = cards.tryGet(creatorAddress + productName).get()
            val getStatus = "Получено".toString()
            card.statusCard = getStatus
            cards.put(creatorAddress + productName, card);
        }
    }
}
