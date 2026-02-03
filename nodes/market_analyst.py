from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Literal
from models.chat_model import llm_with_tools, chat_model
from state.agent_state import AgentState
from config import MARKET_ANALYST_PROMPT_PATH

def analyze_market(preferred_mode: Literal["chat_model", "tools"] = "chat_model"):

    def market_analyzation(state: AgentState) -> AgentState:
        try:
            template = open(MARKET_ANALYST_PROMPT_PATH).read()
        except FileNotFoundError:
            raise ValueError(f"Prompt file missing at {MARKET_ANALYST_PROMPT_PATH}")

        prompt_template = PromptTemplate(
            input_variables=["idea_analysis", "startup_idea"],
            template=template,
        )

        # IMPORTANT: always get a usable final text
        # Tools can run, but final result must always include market_analysis
        chain = prompt_template | chat_model

        print("Invoking market analysis...")
        response = chain.invoke({"idea_analysis": state["idea_analysis"], "startup_idea": state["startup_idea"]})
        print("Market analysis completed.")
        print(f"Market Analysis Response: {response.content}")

        return {
            "market_analysis": response.content,
            "messages": [HumanMessage(state["startup_idea"]), response],
        }

    return market_analyzation
