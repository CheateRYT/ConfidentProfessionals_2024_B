package com.wavesenterprise.domain

data class Product(
    val productNameProduct : String,
    val productDescrProduct : String,
    var confirmProduct : String,
    val regionsProduct : List<String>,
    var minValueProduct : String,
    var maxValueProduct : String,
    var providerAddressProduct : String,
    var selllerAddressesProduct : List<String>
)
