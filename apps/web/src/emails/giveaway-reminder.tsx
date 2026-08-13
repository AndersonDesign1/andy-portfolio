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

interface GiveawayReminderProps {
  name?: string;
}

export const GiveawayReminder = ({ name = "there" }: GiveawayReminderProps) => {
  const previewText = "Action required: Complete your giveaway entry!";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Just one step left! 🎁
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hey {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              The New Year Giveaway has officially ended, and I&apos;m now in
              the process of selecting the winners!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              To make sure you&apos;re eligible for selection, I need to hear
              more about your project vision. Please fill out the feedback form
              if you haven&apos;t yet.
            </Text>
            <Text className="text-[14px] leading-[24px] font-bold text-black">
              The selected participants will be announced on Monday, January
              12th at 12:00 PM (GMT+1).
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Make sure to submit your feedback before that time to stay in the
              running!
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href="https://andersonjoseph.com/giveaway/feedback"
              >
                Submit My Feedback
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
              I can&apos;t wait to hear from you!
              <br />
              Anderson
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
