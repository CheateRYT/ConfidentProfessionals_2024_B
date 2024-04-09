package com.wavesenterprise.domain

data class Application(
    val fioApplication : String,
    val contactDataApplication : String,
    val addressApplication : String,
    val companyNameApplication : String,
    val companyDescrApplication : String,
    val roleApplication : String,
    var confirmApplication : String,
    val regionsApplication : List<String>,
    val productListApplication : List<String>
)
