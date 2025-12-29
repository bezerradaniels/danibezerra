import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'daniel.ddsb@gmail.com'

interface ContactData {
  nome: string
  email: string
  whatsapp: string
  empresa?: string
  projeto: string
  mensagem?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json() as { record: ContactData }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    const projetoLabel = {
      'onepage': 'Site One Page',
      'multipage': 'Site Multi Page',
      'copiloto': 'Copiloto de Marketing',
      'outro': 'Outro'
    }[record.projeto] || record.projeto

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF8F3;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; border-radius: 16px 16px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #14CC45;">&lt;db/&gt;</span>
                    <span style="font-size: 20px; font-weight: 600; color: #ffffff; margin-left: 8px;">DaniBezerra</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                      🎉 Novo contato recebido!
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 16px; color: #94a3b8;">
                      Alguém preencheu o formulário de orçamento
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">
              
              <!-- Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; overflow: hidden;">
                
                <!-- Nome -->
                <tr>
                  <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #14CC45; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">👤</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Nome</p>
                          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #0f172a;">${record.nome}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Email -->
                <tr>
                  <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #3b82f6; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">✉️</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #0f172a;">
                            <a href="mailto:${record.email}" style="color: #3b82f6; text-decoration: none;">${record.email}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- WhatsApp -->
                <tr>
                  <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #22c55e; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">📱</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #0f172a;">
                            <a href="https://wa.me/55${record.whatsapp.replace(/\D/g, '')}" style="color: #22c55e; text-decoration: none; font-weight: 500;">${record.whatsapp}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Empresa -->
                <tr>
                  <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #8b5cf6; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🏢</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Empresa</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #0f172a;">${record.empresa || 'Não informado'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Tipo de Projeto -->
                <tr>
                  <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #f59e0b; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">📋</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Tipo de Projeto</p>
                          <p style="margin: 4px 0 0 0;">
                            <span style="display: inline-block; background-color: #14CC45; color: #ffffff; font-size: 14px; font-weight: 600; padding: 6px 14px; border-radius: 20px;">${projetoLabel}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Mensagem -->
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 36px; height: 36px; background-color: #ec4899; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">💬</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Mensagem</p>
                          <p style="margin: 8px 0 0 0; font-size: 15px; color: #334155; line-height: 1.6; background-color: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #14CC45;">${record.mensagem || '<em style="color: #94a3b8;">Nenhuma mensagem adicional</em>'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/55${record.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(record.nome)}%2C%20recebi%20seu%20contato%20pelo%20site!" 
                       style="display: inline-block; background-color: #14CC45; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 50px; box-shadow: 0 4px 14px rgba(20, 204, 69, 0.4);">
                      Responder via WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                Este email foi enviado automaticamente pelo site
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">
                <a href="https://danibezerra.com" style="color: #14CC45; text-decoration: none; font-weight: 500;">danibezerra.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DaniDev <noreply@danibezerra.com>',
        to: [ADMIN_EMAIL],
        subject: `Novo contato: ${record.nome} - ${record.projeto}`,
        html: emailHtml,
        reply_to: record.email,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao enviar email')
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erro:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
