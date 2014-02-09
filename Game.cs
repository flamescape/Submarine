using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Battleships
{
    class Ai
    {
        int state;
        int boardSize;
        bool[, ,] board;
        bool[, ,] triedBefore;
        Position dirVector;
        Position FirstHit;
        Position Prev;
        public Ai(int boardSize)
        {
            this.boardSize = boardSize;
            triedBefore = new bool[boardSize, boardSize, boardSize];
            // Init all to false if necesarry          

        }
        public Position getAction()
        {
            if (state == 1)
            {
                Position newLocation = newRandomLocation(0, boardSize);
                while (triedBefore[newLocation.x, newLocation.y, newLocation.z])
                {
                    newLocation = newRandomLocation(0, boardSize);
                }
                Prev = newLocation;
                return newLocation;
            }
            if (state == 2)
            {
                // Location around prev hit
                Position newLocation = newRandomLocation(0, boardSize);
                while (!inBounds(newLocation) || triedBefore[newLocation.x, newLocation.y, newLocation.z])
                {
                    // Location around prev hit
                    newLocation = newRandomLocation(0, boardSize);
                }
                Prev = newLocation;
                return newLocation;
            }
            else //state == 3
            {
                Position newLocation = Prev + dirVector;
                while (!inBounds(newLocation) || triedBefore[newLocation.x, newLocation.y, newLocation.z])
                {
                    dirVector *= -1;
                    newLocation = FirstHit + dirVector;                    
                }
                Prev = newLocation;
                return newLocation;
            }
        }

        private bool inBounds(Position newLocation)
        {
            if (newLocation.x > boardSize || newLocation.y > boardSize || newLocation.z > boardSize)
                return false;
            return true;
        }

        private Position newRandomLocation(int p, int boardSize)
        {
            throw new NotImplementedException();
        }
        private Position RandomLocationAround(Position p)
        {
            throw new NotImplementedException();            
        }

        public void ReportAction(bool hit, int x, int y, int z)
        {
            if (hit)
            {
                if (state == 1)
                {
                    state = 2;
                    FirstHit = Prev;
                }
                if (state == 2)
                {
                    dirVector = FirstHit - Prev;
                    Prev = new Position(x, y, z);
                    state = 3;
                }
            }
            else
            {
                if (state == 3)
                {
                    dirVector *= -1;
                    Prev = FirstHit;
                }
            }
        }
    }    
    class Position
    {
        public int x, y, z;
        public Position(int x, int y, int z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        public static Position operator +(Position a, Position b)
        {
            return new Position(a.x + b.x, a.y + b.y, a.z + b.z);
        }
        public static Position operator -(Position a, Position b)
        {
            return new Position(a.x - b.x, a.y - b.y, a.z - b.z);
        }
        public static Position operator *(Position a, int b)
        {
            return new Position(a.x * b, a.y * b, a.z * b);
        }
    }

}
