package com.ainoob.elvinapp.backend.service.impl

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.repository.*
import com.ainoob.elvinapp.backend.service.GreetingService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import org.json.JSONObject

@Service
class GreetingServiceImpl(
    private val greetingTemplateRepository: GreetingTemplateRepository,
    private val generatedGreetingRepository: GeneratedGreetingRepository,
    private val solarTermRepository: SolarTermRepository,
    private val traditionalHolidayRepository: TraditionalHolidayRepository
) : GreetingService {

    private val dateFormatter = DateTimeFormatter.ofPattern("MMdd")

    private fun getTimeBasedPrefix(): String {
        val hour = LocalDateTime.now().hour
        return when (hour) {
            in 5..11 -> "早上好！"
            in 12..13 -> "中午好！"
            in 14..17 -> "下午好！"
            in 18..23 -> "晚上好！"
            else -> "夜深了！"
        }
    }

    override fun getTodayGreeting(): GeneratedGreeting? {
        val today = LocalDate.now().format(dateFormatter)
        return generatedGreetingRepository.findAll().find { it.date == today }
    }

    override fun generateGreeting(type: String, occasionType: String): GeneratedGreeting {
        val today = LocalDate.now().format(dateFormatter)
        
        // Find special occasion and its properties
        val (occasionId, occasionName) = when (occasionType) {
            "solar-term" -> {
                val term = solarTermRepository.findAll().find { it.date == today }
                    ?: throw IllegalStateException("No solar term found for today")
                Pair(term.id, term.name)
            }
            "traditional-holiday" -> {
                val holiday = traditionalHolidayRepository.findAll().find { it.date == today }
                    ?: throw IllegalStateException("No traditional holiday found for today")
                Pair(holiday.id, holiday.name)
            }
            else -> throw IllegalArgumentException("Invalid occasion type: $occasionType")
        }

        // Find appropriate template
        val template = greetingTemplateRepository.findAll()
            .find { it.type == type && it.occasionType == occasionType }
            ?: throw IllegalStateException("No template found for type: $type and occasion: $occasionType")

        // Generate greeting content with time-based prefix
        val timePrefix = getTimeBasedPrefix()
        val content = timePrefix + when (occasionType) {
            "solar-term" -> template.templateContent.replace("{solar_term}", occasionName)
            "traditional-holiday" -> template.templateContent.replace("{holiday}", occasionName)
            else -> throw IllegalArgumentException("Invalid occasion type")
        }

        // Create and save greeting
        return GeneratedGreeting(
            id = UUID.randomUUID().toString(),
            date = today,
            occasionId = occasionId,
            occasionType = occasionType,
            content = content,
            type = type
        ).also { generatedGreetingRepository.save(it) }
    }

    override fun getTemplates(): List<GreetingTemplate> =
        greetingTemplateRepository.findAll()
}
