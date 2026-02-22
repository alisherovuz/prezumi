import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })
    const { type, context } = await request.json()

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    const prompt = buildPrompt(type, context)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach. You write clear, impactful, ATS-optimized content. Always be concise and professional.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      content,
      type,
    })
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    
    // Check for specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      )
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'OpenAI rate limit reached. Please try again later.' },
        { status: 429 }
      )
    }
    
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI quota exceeded. Please add credits to your account.' },
        { status: 402 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}

function buildPrompt(type: string, context: any): string {
  const jobTitle = context?.jobTitle || 'professional'
  const company = context?.company || ''
  const experience = context?.experience || ''
  const skills = context?.skills || ''
  const text = context?.text || ''
  const targetJob = context?.targetJob || ''

  switch (type) {
    case 'summary':
      return `Write a professional resume summary (2-3 sentences) for a ${jobTitle}. 
              Make it impactful, results-oriented, and ATS-friendly.
              Focus on value proposition and key strengths.
              Do not use first person pronouns.
              Return only the summary text, no quotes or extra formatting.`

    case 'experience':
      return `Write 3-4 impactful bullet points for a ${jobTitle} position at ${company}.
              Context: ${experience}
              
              Requirements:
              - Start each bullet with a strong action verb
              - Include metrics and quantifiable achievements where possible
              - Be specific and results-oriented
              - Keep each bullet to 1-2 lines
              - Make them ATS-friendly
              
              Return only the bullet points, each on a new line starting with •`

    case 'skills':
      return `Suggest 10-15 relevant skills for a ${jobTitle} position.
              Include both technical and soft skills.
              Focus on in-demand, ATS-friendly keywords.
              Return as a comma-separated list, no extra formatting.`

    case 'improve':
      return `Improve the following resume text to be more impactful, professional, and ATS-friendly.
              Keep the same meaning but make it stronger.
              
              Original text: ${text}
              
              Return only the improved text, no explanations.`

    case 'cover_letter':
      return `Write a professional cover letter for a ${targetJob} position at ${company}.
              
              Candidate background:
              - Current/Recent role: ${jobTitle}
              - Key skills: ${skills}
              - Experience highlights: ${experience}
              
              Requirements:
              - 3-4 paragraphs
              - Professional but personable tone
              - Highlight relevant experience and skills
              - Show enthusiasm for the role
              - Include a strong call to action
              
              Return only the cover letter body (no greeting or signature).`

    case 'linkedin_headline':
      return `Write 3 compelling LinkedIn headline options for a ${jobTitle}.
              Each should be under 120 characters.
              Make them keyword-rich and attention-grabbing.
              Return each option on a new line, numbered 1-3.`

    case 'linkedin_summary':
      return `Write a LinkedIn About section (200-300 words) for a ${jobTitle}.
              
              Make it:
              - First person, conversational but professional
              - Include relevant keywords for SEO
              - Highlight unique value proposition
              - End with a call to action
              
              Return only the summary text.`

    default:
      throw new Error('Invalid generation type')
  }
}
