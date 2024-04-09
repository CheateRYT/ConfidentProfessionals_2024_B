package com.wavesenterprise.api

import com.wavesenterprise.sdk.contract.api.annotation.ContractAction
import com.wavesenterprise.sdk.contract.api.annotation.ContractInit

interface RentCarContract {

    @ContractInit
    fun initRent()

    @ContractAction
    fun registerProduct(productName: String, productDescr: String, productRegions: String)

    @ContractAction
    fun confirmProduct(productName : String, providerAddress : String, minValue : String, maxValue : String, sellerAddreses : String)

    @ContractAction
    fun registerApplication(companyName : String, companyDescr: String, role: String, regions : String, fio : String, contactData : String, )

    @ContractAction
    fun confirmApplication(address : String)

    @ContractAction
    fun registerCard(productName : String, volume : String, wantedDate : String, deliveryAddress : String, sellerAddress : String, sellerCompanyName : String)

    @ContractAction
    fun allowCard(productName : String, clientAddress : String, confirmedDate : String, paymentRules : String)

    @ContractAction
    fun confirmCard(productName : String)

    @ContractAction
    fun ejectCard(productName : String)

    @ContractAction()
    fun payCard(productName : String)

    @ContractAction
    fun getCard(productName : String)
}
