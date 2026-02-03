from langchain_core.prompts import PromptTemplate
from typing import Literal
from state.agent_state import AgentState
from models.chat_model import chat_model, llm_with_tools
from config import SWOT_ANALYSIS_PROMPT_PATH

def perform_swot(preferred_mode: Literal["chat_model","tools"]="chat_model"):

    def swot_agent(state: AgentState) -> AgentState:
        try:
            template = open(SWOT_ANALYSIS_PROMPT_PATH).read()
        except FileNotFoundError:
            raise ValueError(f"Prompt file missing at {SWOT_ANALYSIS_PROMPT_PATH}")

        prompt_template = PromptTemplate(
            input_variables=[
                "idea_analysis",
                "market_analysis",
                "competition_analysis",
                "risk_assessment"
            ],
            template=template,
        )

        chain = prompt_template | (chat_model if preferred_mode=="chat_model" else llm_with_tools)

        response = chain.invoke({
            "idea_analysis": state["idea_analysis"],
            "market_analysis": state["market_analysis"],
            "competition_analysis": state["competition_analysis"],
            "risk_assessment": state["risk_assessment"],
        })

        return {
            "swot_analysis": response.content,
            "messages": [response],
        }

    return swot_agent
