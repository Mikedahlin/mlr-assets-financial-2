import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import { invokeLLM, type Message as LLMMessage } from "./llm";

export const aiRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z
          .array(
            z.object({
              role: z.enum(["system", "user", "assistant", "tool", "function"]),
              content: z.string(),
            })
          )
          .min(1),
        maxTokens: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedMessages: LLMMessage[] = input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      try {
        const llmResult = await invokeLLM({
          messages: normalizedMessages,
          maxTokens: input.maxTokens ?? 1024,
          responseFormat: { type: "text" },
        });

        const firstChoice = llmResult.choices?.[0];

        if (!firstChoice?.message || !firstChoice.message.content) {
          throw new Error("No response from LLM");
        }

        return {
          choices: [
            {
              message: {
                role: "assistant",
                content: typeof firstChoice.message.content === "string" ? firstChoice.message.content : JSON.stringify(firstChoice.message.content),
              },
            },
          ],
          raw: llmResult,
        };
      } catch (cause) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI chat generation failed",
          cause,
        });
      }
    }),
});
