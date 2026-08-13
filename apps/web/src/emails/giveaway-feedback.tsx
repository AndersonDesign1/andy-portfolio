import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface GiveawayFeedbackProps {
  name?: string;
}

export const GiveawayFeedback = ({ name = "there" }: GiveawayFeedbackProps) => {
  const previewText = "Help me build your dream website";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Thanks for entering! 🎉
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hey {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              I&apos;m super excited that you&apos;ve entered the giveaway to
              win a free website!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              To make sure I can build something that truly helps you or your
              business, I need a little more info. I&apos;ve put together a
              quick form to understand exactly what you&apos;re looking for.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              This helps me understand your vision and ensures that if you win,
              we hit the ground running.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href="https://andersonjoseph.com/giveaway/feedback"
              >
                Tell Me About Your Project
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this link into your browser:{" "}
              <Link
                className="text-blue-600 no-underline"
                href="https://andersonjoseph.com/giveaway/feedback"
              >
                https://andersonjoseph.com/giveaway/feedback
              </Link>
            </Text>
            <Text className="mt-[32px] text-[12px] leading-[24px] text-[#666666]">
              Good luck!
              <br />
              Anderson
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
