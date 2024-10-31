export const metadata = {
  title: 'AI4SD',
  description: 'AI for Software Development',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
