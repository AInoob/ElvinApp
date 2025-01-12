package com.ainoob.elvinapp.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "solar_terms")
data class SolarTerm(
    @Id
    val id: String,
    val name: String,
    val date: String, // MMDD format
    val description: String? = null
)

@Entity
@Table(name = "traditional_holidays")
data class TraditionalHoliday(
    @Id
    val id: String,
    val name: String,
    val date: String, // MMDD format
    val description: String? = null
)

@Entity
@Table(name = "greeting_templates")
data class GreetingTemplate(
    @Id
    val id: String,
    val type: String, // video or dynamic-text-image
    @Column(name = "occasion_type")
    val occasionType: String, // solar-term or traditional-holiday
    @Column(name = "template_content")
    val templateContent: String,
    val variables: String? = null // JSON string of variables
)

@Entity
@Table(name = "generated_greetings")
data class GeneratedGreeting(
    @Id
    val id: String,
    val date: String,
    @Column(name = "occasion_id")
    val occasionId: String,
    @Column(name = "occasion_type")
    val occasionType: String,
    val content: String,
    val type: String // video or dynamic-text-image
)
