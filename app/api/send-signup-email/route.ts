import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const body = await req.json()
  const { organizationName, email, phone, address, website, reason, gstNumber } = body

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST, // e.g., 'smtpout.secureserver.net'
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    // to: 'contact@innuller.com',
    to: 'contact@innuller.com',
    subject: 'New Company Sign Up Request',
    text: `
      Organization Name: ${organizationName}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}
      Website: ${website}
      GST Number: ${gstNumber}
      Reason for Registration: ${reason}
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}