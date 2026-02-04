from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Annotated
from graphs.workflow import build_graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
graph = build_graph()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartupIdea(BaseModel):
    startup_idea: Annotated[str, Field(...)]


@app.post("/validate")
async def validate(idea: StartupIdea):
    try:
        result = await graph.ainvoke(
            {
                "startup_idea": idea.startup_idea,
                "idea_analysis": None,
                "market_analysis": None,
                "competition_analysis": None,
                "risk_assessment": None,
                "swot_analysis": None,
                "advisor_recommendations": None,
                "advice": None,
                "messages": []
            },
            config={"recursion_limit": 100} 
        )

        print("Validation Result :- ", result)
        result.pop("messages", None)
        return JSONResponse(status_code=200, content=result)

    except Exception as e:
        print("Error :- ", e)
        raise HTTPException(status_code=400, detail=str(e))
