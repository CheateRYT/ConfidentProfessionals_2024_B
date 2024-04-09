package com.wavesenterprise.domain

data class Card(
    val productNameCard : String,
    val volumeCard : String,
    val wantedDateCard : String,
    val sellerAddressCard : String,
    val sellerCompanyNameCard : String,
    val deliveryAddressCard : String,
    var confirmedDateCard : String,
    var paymentRulesCard : String,
    val buyerAddressCard : String,
    var statusCard : String
)
