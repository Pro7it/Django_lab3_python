from datetime import datetime
import math
import os
from concurrent.futures import ProcessPoolExecutor
import pandas as pd

from main.repository.Repository import Repository

ROW_DATA = None


def init_row_data(data):
    global ROW_DATA
    ROW_DATA = data


# важкі обчислення, демонстрація навантаження та різницю при паралелізації
def make_row_analitic(task):
    play, n = task

    size = max(len(play.name), 1)

    arr = []
    for i in range(n):
        for j in range(size):
            val = math.sin(i * j) ** 2 + math.cos(i + j) ** 2 + ((i * j + j**2) % 5)
            arr.append(val)

    df = pd.DataFrame({"values": arr})

    return df["values"].min(),df["values"].max(),df["values"].sum()


class DBParallelTester:
    def __init__(self):
        self.repos = Repository()

    def run(self, threads=1, i=1, ultimate=False):
        def time_end(ts, r=4):
            return round((datetime.now() - ts).total_seconds(), r)

        total_time = datetime.now()
        left_bound_threads = 1 if ultimate else threads

        row_data = list(self.repos.plays.get_all())

        analitics = []
        
        data = None

        for ithreads in range(left_bound_threads, threads + 1):
            tasks = [(r, i) for r in row_data]

            with ProcessPoolExecutor(max_workers=ithreads) as executor:
                start_work = datetime.now()
                results = list(executor.map(make_row_analitic, tasks))
                work_time = time_end(start_work)
            
            if data is None:
                data = results
                
            

            analitics.append(
                {
                    "threads": ithreads,
                    "time": work_time,
                }
            )
        
        
        mins, maxs, sums = zip(*data) 

        data = {
            "min": min(mins),
            "max": max(maxs),
            "sum": sum(sums)
        }


        return {
            "iterations": i,
            "plays": len(row_data),
            "pc_threads": os.cpu_count(),
            "requested_threads": threads,
            "total_time": time_end(total_time),
            "details": analitics,
            "data": data
        }
