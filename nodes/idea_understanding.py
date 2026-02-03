from langchain_core.prompts import PromptTemplate
from typing import Literal
from state.agent_state import AgentState
from models.chat_model import chat_model, llm_with_tools
from config import IDEA_UNDERSTANDING_PROMPT_PATH

def understand_idea(preferred_mode: Literal["chat_model","tools"]="chat_model"):

    def idea_agent(state: AgentState) -> AgentState:
        try:
            template = open(IDEA_UNDERSTANDING_PROMPT_PATH).read()
        except FileNotFoundError:
            raise ValueError(f"Prompt file missing at {IDEA_UNDERSTANDING_PROMPT_PATH}")

        prompt_template = PromptTemplate(
            input_variables=["startup_idea"],
            template=template,
        )

        chain = prompt_template | (chat_model if preferred_mode=="chat_model" else llm_with_tools)

        response = chain.invoke({
            "startup_idea": state["startup_idea"]
        })

        return {
            "idea_analysis": response.content,
            "messages": [response],
        }

    return idea_agent
