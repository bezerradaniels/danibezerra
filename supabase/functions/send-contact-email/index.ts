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
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="max-width: 520px; width: 100%; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 14px; font-weight: 600; color: #0f172a;">Novo contato</span>
                    <span style="font-size: 12px; color: #64748b; margin-left: 8px;">${projetoLabel}</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #94a3b8;">${new Date().toLocaleDateString('pt-BR')}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                
                <!-- Nome e Empresa -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #0f172a;">${record.nome}</p>
                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">${record.empresa || 'Empresa não informada'}</p>
                  </td>
                </tr>
                
                <!-- Contatos em linha -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right: 20px;">
                          <span style="font-size: 11px; color: #94a3b8; display: block;">Email</span>
                          <a href="mailto:${record.email}" style="font-size: 13px; color: #3b82f6; text-decoration: none;">${record.email}</a>
                        </td>
                        <td>
                          <span style="font-size: 11px; color: #94a3b8; display: block;">WhatsApp</span>
                          <a href="https://wa.me/55${record.whatsapp.replace(/\D/g, '')}" style="font-size: 13px; color: #22c55e; text-decoration: none;">${record.whatsapp}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Mensagem -->
                ${record.mensagem ? `
                <tr>
                  <td style="padding-top: 12px; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8;">Mensagem</p>
                    <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">${record.mensagem}</p>
                  </td>
                </tr>
                ` : ''}
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="https://wa.me/55${record.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(record.nome)}!" 
                       style="display: inline-block; background: #14CC45; color: #fff; font-size: 13px; font-weight: 500; text-decoration: none; padding: 8px 16px; border-radius: 6px;">
                      Responder
                    </a>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #94a3b8;">dani.dev.br</span>
                  </td>
                </tr>
              </table>
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
