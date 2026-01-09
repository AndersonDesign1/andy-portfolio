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
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Just one step left! 🎁
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hey {name},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              The New Year Giveaway has officially ended, and I'm now in the
              process of selecting the winners!
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              To make sure you're eligible for selection, I need to hear more
              about your project vision. Please fill out the feedback form if
              you haven't yet.
            </Text>
            <Text className="font-bold text-[14px] text-black leading-[24px]">
              The selected participants will be announced on Monday, January
              12th at 12:00 PM (GMT+1).
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Make sure to submit your feedback before that time to stay in the
              running!
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href="https://andersonjoseph.com/giveaway/feedback"
              >
                Submit My Feedback
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this link into your browser:{" "}
              <Link
                className="text-blue-600 no-underline"
                href="https://andersonjoseph.com/giveaway/feedback"
              >
                https://andersonjoseph.com/giveaway/feedback
              </Link>
            </Text>
            <Text className="mt-[32px] text-[#666666] text-[12px] leading-[24px]">
              I can't wait to hear from you!
              <br />
              Anderson
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default GiveawayReminder;
