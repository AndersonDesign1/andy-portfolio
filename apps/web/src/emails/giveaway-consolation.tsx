import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface GiveawayConsolationEmailProps {
  name: string;
}

export const GiveawayConsolationEmail = ({
  name,
}: GiveawayConsolationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Free website giveaway update</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hey {name},</Heading>

          <Text style={text}>
            First off, I want to say a huge thank you for participating in my
            free website giveaway. I was overwhelmed by the number of amazing
            projects and business ideas that were submitted!
          </Text>

          <Text style={text}>
            While you weren&apos;t selected as one of the winners for a
            completely free website this time, I still want to help you get your
            project off the ground.
          </Text>

          <Section style={box}>
            <Text style={subheading}>A special offer for you:</Text>
            <Text style={text}>
              I&apos;m offering you a <strong>50% discount</strong> on my
              standard website design and development services.
            </Text>
            <Text style={text}>
              If you&apos;re interested in moving forward with your project at
              this special rate, I&apos;d love to chat.
            </Text>
            <Link
              href="mailto:hello@andersonjoseph.com?subject=Discounted Website Project"
              style={button}
            >
              Let&apos;s talk about your project
            </Link>
          </Section>

          <Text style={text}>
            Whether we work together or not, I wish you the best of luck with
            your journey!
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
  textAlign: "left" as const,
  margin: "30px 0",
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

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "32px",
};
