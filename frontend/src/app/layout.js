export const metadata = {
  title: 'AI4SD',
  description: 'AI for Software Development',
}

import styles from "./page.module.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.main}>{children}</body>
    </html>
  )
}
