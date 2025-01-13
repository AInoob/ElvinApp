package com.ainoob.elvinapp.backend.config

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.repository.*
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.UUID

@Configuration
class DataInitializer {
    @Bean
    fun initData(
        solarTermRepository: SolarTermRepository,
        traditionalHolidayRepository: TraditionalHolidayRepository,
        greetingTemplateRepository: GreetingTemplateRepository
    ) = CommandLineRunner {
        // Initialize Solar Terms
        val solarTerms = listOf(
            SolarTerm(
                id = UUID.randomUUID().toString(),
                name = "立春",
                date = "0204",
                description = "立春，为二十四节气之首。"
            ),
            SolarTerm(
                id = UUID.randomUUID().toString(),
                name = "雨水",
                date = "0219",
                description = "雨水节气，雨量渐增。"
            ),
            SolarTerm(
                id = UUID.randomUUID().toString(),
                name = "惊蛰",
                date = "0305",
                description = "惊蛰，春雷始鸣。"
            )
        )
        solarTermRepository.saveAll(solarTerms)

        // Initialize Traditional Holidays
        val holidays = listOf(
            TraditionalHoliday(
                id = UUID.randomUUID().toString(),
                name = "春节",
                date = "0101",
                description = "农历新年，中国最重要的传统节日。"
            ),
            TraditionalHoliday(
                id = UUID.randomUUID().toString(),
                name = "元宵节",
                date = "0115",
                description = "正月十五闹元宵。"
            ),
            TraditionalHoliday(
                id = UUID.randomUUID().toString(),
                name = "端午节",
                date = "0505",
                description = "五月初五，龙舟竞渡。"
            )
        )
        traditionalHolidayRepository.saveAll(holidays)

        // Initialize Greeting Templates
        val templates = listOf(
            GreetingTemplate(
                id = UUID.randomUUID().toString(),
                type = "dynamic-text-image",
                occasionType = "solar-term",
                templateContent = "早上好！今天是{solar_term}，愿您身体健康，万事如意！",
                variables = """{"solar_term": ""}"""
            ),
            GreetingTemplate(
                id = UUID.randomUUID().toString(),
                type = "dynamic-text-image",
                occasionType = "traditional-holiday",
                templateContent = "早上好！祝您{holiday}快乐，阖家幸福，吉祥安康！",
                variables = """{"holiday": ""}"""
            ),
            GreetingTemplate(
                id = UUID.randomUUID().toString(),
                type = "video",
                occasionType = "solar-term",
                templateContent = "今天是{solar_term}，祝您节气愉快！",
                variables = """{"solar_term": ""}"""
            ),
            GreetingTemplate(
                id = UUID.randomUUID().toString(),
                type = "video",
                occasionType = "traditional-holiday",
                templateContent = "欢度{holiday}，万事如意！",
                variables = """{"holiday": ""}"""
            )
        )
        greetingTemplateRepository.saveAll(templates)
    }
}
