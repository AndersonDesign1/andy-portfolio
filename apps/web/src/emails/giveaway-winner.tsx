import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface GiveawayWinnerEmailProps {
  name: string;
}

export const GiveawayWinnerEmail = ({ name }: GiveawayWinnerEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You won the free website giveaway! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Congratulations, {name}! 🎉</Heading>

          <Section style={imageSection}>
            <Img
              alt="Celebration"
              height="240"
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHYzeXo5ZzZ4eXo5ZzZ4eXo5ZzZ4eXo5ZzZ4eXo5ZzZ4eZzZ4ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYH8Q8i9qL8O6Y8/giphy.gif"
              style={image}
              width="430"
            />
          </Section>

          <Text style={text}>
            I have some exciting news — you&apos;ve been selected as one of the
            winners for my free website giveaway!
          </Text>

          <Text style={text}>
            I&apos;m really looking forward to working on your project and
            helping you get your business or idea online.
          </Text>

          <Section style={box}>
            <Text style={subheading}>Next Steps:</Text>
            <Text style={text}>
              To get started, please message me on WhatsApp to discuss your
              project details and domain setup:
            </Text>
            <Link
              href="https://wa.me/2348123456789" // Replace with actual WhatsApp link
              style={button}
            >
              Message me on WhatsApp
            </Link>
            <Text style={note}>
              Please reach out within the next 7 days to claim your prize.
            </Text>
          </Section>

          <Text style={text}>
            Alternatively, you can simply reply to this email and we can take it
            from there.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            Anderson Joseph
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const imageSection = {
  padding: "20px 0",
};

const image = {
  margin: "0 auto",
  borderRadius: "8px",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const box = {
  padding: "24px",
  backgroundColor: "#f9f9f9",
  borderRadius: "12px",
  margin: "24px 0",
};

const subheading = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
  margin: "16px 0",
};

const note = {
  color: "#666",
  fontSize: "14px",
  fontStyle: "italic",
  margin: "12px 0 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "32px",
};
