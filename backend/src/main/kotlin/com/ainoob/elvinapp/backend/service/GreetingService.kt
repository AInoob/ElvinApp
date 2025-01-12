package com.ainoob.elvinapp.backend.service

import com.ainoob.elvinapp.backend.model.*

interface GreetingService {
    fun getTodayGreeting(): GeneratedGreeting?
    fun generateGreeting(type: String, occasionType: String): GeneratedGreeting
    fun getTemplates(): List<GreetingTemplate>
}
