from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import ToolMessage
from state.agent_state import AgentState

from nodes.market_analyst import analyze_market
from nodes.competitor_analysis import analyze_competition
from nodes.risk_assessor import assess_risk
from nodes.advisor import advisor
from nodes.swot_analysis import perform_swot
from nodes.idea_understanding import understand_idea

from tools.web_search_tool import web_search


def router(state: AgentState) -> str:
    messages = state.get("messages", [])
    last_msg = messages[-1] if messages else None

    pending = None
    for key in ["idea_analysis","market_analysis", "competition_analysis", "risk_assessment","swot_analysis"]:
        if state.get(key) is None:
            pending = key
            break

    if pending is None:
        return "advisor"

    if isinstance(last_msg, ToolMessage) and last_msg.content == "tool_failed":
        if pending == "idea_analysis":
            return "understand_idea_fallback"
        if pending == "market_analysis":
            return "analyze_market_fallback"
        if pending == "competition_analysis":
            return "analyze_competition_fallback"
        if pending == "risk_assessment":
            return "assess_risk_fallback"
        if pending == "swot_analysis":
            return "perform_swot_fallback"
        
    if pending == "idea_analysis":
        return "understand_idea"
    if pending == "market_analysis":
        return "analyze_market"
    if pending == "competition_analysis":
        return "analyze_competition"
    if pending == "risk_assessment":
        return "assess_risk"
    if pending == "swot_analysis":
        return "perform_swot"

    return "advisor"


def build_graph():
    graph_builder = StateGraph(AgentState)

    graph_builder.add_node("understand_idea", understand_idea("chat_model"))
    graph_builder.add_node("analyze_market", analyze_market("chat_model"))
    graph_builder.add_node("analyze_competition", analyze_competition("chat_model"))
    graph_builder.add_node("assess_risk", assess_risk("chat_model"))
    graph_builder.add_node("perform_swot", perform_swot("chat_model"))

    graph_builder.add_node("understand_idea_fallback", understand_idea("chat_model"))
    graph_builder.add_node("analyze_market_fallback", analyze_market("chat_model"))
    graph_builder.add_node("analyze_competition_fallback", analyze_competition("chat_model"))
    graph_builder.add_node("assess_risk_fallback", assess_risk("chat_model"))
    graph_builder.add_node("perform_swot_fallback", perform_swot("chat_model"))

    graph_builder.add_node("tools", ToolNode(tools=[web_search]))

    graph_builder.add_node("advisor", advisor)

    graph_builder.set_entry_point("understand_idea")

    graph_builder.add_conditional_edges(
        "understand_idea",
        tools_condition,
        {"tools": "tools", "__end__": "analyze_market"}
    )

    graph_builder.add_conditional_edges(
        "analyze_market",
        tools_condition,
        {"tools": "tools", "__end__": "analyze_competition"}
    )

    graph_builder.add_conditional_edges(
        "analyze_competition",
        tools_condition,
        {"tools": "tools", "__end__": "assess_risk"}
    )

    graph_builder.add_conditional_edges(
        "assess_risk",
        tools_condition,
        {"tools": "tools", "__end__": "perform_swot"}
    )

    graph_builder.add_conditional_edges(
        "perform_swot",
        tools_condition,
        {"tools": "tools", "__end__": "advisor"}
    )

    graph_builder.add_conditional_edges("tools", router)

    graph_builder.add_edge("understand_idea_fallback", "analyze_market")
    graph_builder.add_edge("analyze_market_fallback", "analyze_competition")
    graph_builder.add_edge("analyze_competition_fallback", "assess_risk")
    graph_builder.add_edge("assess_risk_fallback", "perform_swot")
    graph_builder.add_edge("perform_swot_fallback", "advisor")

    graph_builder.add_edge("advisor", END)

    # ✔ No config here
    graph = graph_builder.compile()

    return graph
