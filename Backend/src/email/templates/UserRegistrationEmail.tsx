import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface UserRegistrationEmailProps {
  userName: string;
  userEmail: string;
}

const UserRegistrationEmail = ({
  userName,
  userEmail,
}: UserRegistrationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px] px-1">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Heading className="text-[28px] font-bold text-gray-900 mb-[24px] text-center">
                Welcome to Flavorly! 🎉
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[20px]">
                Hi {userName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[20px]">
                Congratulations! Your account has been successfully created.
                We're excited to have you join our culinary community.
              </Text>

              <Section className="bg-gray-50 rounded-[8px] p-[20px] mb-[24px]">
                <Text className="text-[14px] text-gray-600 mb-[8px]">
                  <strong>Email:</strong> {userEmail}
                </Text>
                <Text className="text-[14px] text-gray-600 mb-[0px]">
                  <strong>Registration Date:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </Text>
              </Section>

              <Section className="text-center mb-[32px]">
                <Button
                  href={`${process.env.FRONTEND_URL || "http://localhost:5173"}/explore`}
                  className="bg-red-600 text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-semibold no-underline"
                >
                  Start Exploring Recipes
                </Button>
              </Section>

              <Section className="mb-[24px]">
                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  🍳 Browse thousands of recipes
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  📖 Create and share your recipes
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[8px]">
                  ❤️ Save your favorites
                </Text>
                <Text className="text-[14px] text-gray-700 mb-[0px]">
                  👨‍🍳 Connect with food lovers
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 mb-[24px]">
                Best regards,
                <br />
                The Flavorly Team
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            <Section>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                © 2026 Flavorly. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserRegistrationEmail;
