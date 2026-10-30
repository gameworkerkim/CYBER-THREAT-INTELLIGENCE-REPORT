/* init.c - CVE-2026-98432 검증랩용 최소 init (initramfs pid 1)
 *
 * - /proc 마운트, 배너 출력
 * - 0.0.0.0:4444 TCP 리스너 (리프로듀서 대상)
 * 빌드: gcc -static -O2 -o init init.c  (Linux에서)
 */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <sys/mount.h>
#include <sys/socket.h>
#include <sys/utsname.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 4444

int main(void)
{
    struct utsname u;
    struct sockaddr_in sa, peer;
    socklen_t plen;
    char buf[256];
    int s, c;

    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

#ifdef __linux__
    if (mount("proc", "/proc", "proc", 0, NULL) && errno != EBUSY)
        printf("mount proc failed: %s\n", strerror(errno));
#endif

    if (uname(&u) == 0)
        printf("CTI-2026-98432 lab init: kernel %s %s\n",
               u.release, u.version);

    s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        printf("socket failed: %s\n", strerror(errno));
        for (;;) sleep(3600);
    }
    {
        int one = 1;
        setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &one, sizeof(one));
    }
    memset(&sa, 0, sizeof(sa));
    sa.sin_family = AF_INET;
    sa.sin_addr.s_addr = INADDR_ANY;
    sa.sin_port = htons(PORT);
    if (bind(s, (struct sockaddr *)&sa, sizeof(sa)) < 0) {
        printf("bind failed: %s\n", strerror(errno));
        for (;;) sleep(3600);
    }
    if (listen(s, 128) < 0) {
        printf("listen failed: %s\n", strerror(errno));
        for (;;) sleep(3600);
    }

    printf("listening on 0.0.0.0:%d\n", PORT);

    for (;;) {
        plen = sizeof(peer);
        c = accept(s, (struct sockaddr *)&peer, &plen);
        if (c < 0)
            continue;
        printf("conn from %s:%d\n", inet_ntoa(peer.sin_addr),
               ntohs(peer.sin_port));
        while (recv(c, buf, sizeof(buf), 0) > 0)
            ;
        close(c);
    }
    return 0;
}
